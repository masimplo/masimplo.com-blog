---
layout: post
title: My Canon G5040 had no Mac app, so Claude Code reverse-engineered one
author: [masimplo]
tags: [AI, Tools, Code, Technology]
image: ../../images/headers/canon-g5040-mac-printer-manager.png
date: 2026-10-30
draft: true
excerpt: Canon ships no Mac utility for the Canon G5040. In one session, Claude Code reverse-engineered its maintenance protocol and built me one.
---

My printer stopped printing, and I had no way to ask it why. It's a Canon PIXMA G5040, one of the MegaTank models with refillable ink tanks, and on the Canon G5040 a Mac user gets an AirPrint queue and nothing else. Canon has no management app for macOS. Its Mac driver does have a Utility tab with cleaning and a nozzle check, but only when you install Canon's own CUPS driver instead of the AirPrint queue macOS sets up by itself. For everything else, Canon sends you to the printer's built-in web page, the Remote UI.

The Remote UI wouldn't let me log in. A PDF sat in the queue going nowhere. So I asked Claude Code to find out. One session later I had a diagnosis, a reverse-engineered maintenance protocol, and the Mac app Canon never wrote. My part was answering a few questions.

## Two problems, neither of them the printer

Two separate problems were hiding behind "the printer is broken".

The first was timing. I'd switched the printer on about seven minutes earlier, and a PIXMA runs a cleaning cycle at power-on. Claude Code's first IPP query came back with `printer-is-accepting-jobs = false` and a "spool area full" reason, and the Remote UI showed "Cleaning in progress". The printer had aborted my PDF mid-cleaning, and **macOS responded by pausing the whole print queue**, leaving the job stuck inside it. Nothing on the Mac said "paused" loudly enough for me to notice. Resuming the queue fixed printing.

The second was the Remote UI login, and it took longer to pin down. The pages loaded, and all nine of its scripts loaded too. The admin form hashes your password with SHA-256 and posts it to `sendpw.cgi`. The printer answers a right password and a wrong one identically: a redirect back to the login page. So a rejected password doesn't produce an error. It produces a loop that looks exactly like a broken page. Both the password I had and the factory default were rejected, and to this day I don't know why. The HTTPS certificate doesn't help either: it's self-signed and issued for the IP address only, so opening the UI through the printer's `.local` name adds a name-mismatch warning on top.

At that point I could print again. I still couldn't run a nozzle check, see the paper count, or change a setting without a login that didn't work. Being a tinkerer, I wanted those back.

## The commands it accepted and ignored

The printer advertises itself over Bonjour as `_ipp`, `_ipps`, `_printer`, `_pdl-datastream` (raw port 9100), `_http`, and one I didn't recognise, `_canon-chmp`. IPP's Get-Printer-Attributes returns 108 attributes, including ink levels (estimates, on a tank printer) and an IEEE 1284 device ID:

```
CMD:BJRaster3,NCCe,IVEC,URF;SOJ:CHMP,CHMPu
```

My first plan for maintenance came from Canon's open-source Linux driver, [cnijfilter2](https://github.com/endlessm/cnijfilter2). Its PPD files list maintenance commands like `@TestPrint=NozzleCheck` and `@Cleaning=1ALL`, and its `cmdtocanonij2` filter wraps them in a BJL control block, `ESC [ K 02 00 00 1F "BJLSTART\n" … "BJLEND\n"`. [Gutenprint](https://github.com/echiu64/gutenprint) does the same thing inside Canon's IVEC XML `StartJob`/`EndJob` envelope. Claude Code built every variant of that it could, and sent them over raw port 9100 and as IPP print jobs.

**The G5040 accepted every one and did nothing.** IPP even reported the job "completed successfully", with zero pages printed. A printer that says "no" would have been more useful.

The next move was Claude Code's own idea: running `strings` on Canon's closed library, `libcnbpcnclapicom2.so`. It gave up the exact IVEC XML templates the driver sends. It also explained the `_canon-chmp` service: CHMP is Canon's management channel over plain HTTP on port 80, and it reports things IPP doesn't, like paper per tray, sheets fed per tray (5,840 at the time), print-head replacement counts, Canon support codes and ink.

It has one quirk you won't guess. You POST an IVEC command to `/canon/ij/command2/port1`, then GET the *same path* to read the reply, and the GET must go over the same keep-alive connection. A GET on a fresh connection returns HTTP 409. The client ended up as a raw socket rather than `fetch`:

```js
async command(xml) {
  const body = Buffer.from(xml, 'utf8');
  const posted = await this.#exchange(
    Buffer.concat([Buffer.from(this.#headers('POST', body.length), 'latin1'), body]),
  );
  if (posted.status !== 200) throw new Error(`CHMP command rejected with HTTP ${posted.status}`);
  const reply = await this.#exchange(Buffer.from(this.#headers('GET'), 'latin1'));
  return reply.body.toString('utf8');
}
```

Status worked. Maintenance still didn't.

## The detail that unlocked maintenance

The missing piece came from a research agent running alongside the main session, reading driver source while Claude Code kept poking at sockets. Canon's newer driver release, cnijfilter2 6.81, moved the G5000 series off `cmdtocanonij2` and onto a new `cmdtocanonij3` filter. That one speaks pure IVEC XML with `servicetype="maintenance"`, and BJL is kept only for 31 older models. Two other open projects, fixma-pixma (tested on a G7020) and OpenIJ, use the same command shapes. A nozzle check looks like this:

```xml
<ivec:operation>TestPrint</ivec:operation>
<ivec:param_set servicetype="maintenance">
  <ivec:jobID>00000002</ivec:jobID>
  <ivec:type>nozzle_check</ivec:type>
  <ivec:inputbin>inputbin_p2</ivec:inputbin>
  <ivec:papersize>iso_a4_210x297mm</ivec:papersize>
  <ivec:papertype>stationery</ivec:papertype>
</ivec:param_set>
```

The first try over CHMP half-worked. `StartJob` came back `OK`, and `TestPrint` came back `NotStart`. Each command had gone out on a new connection, the way you'd talk to any HTTP API. **The printer ties a job to the TCP connection that started it**, so `StartJob`, `TestPrint` and `EndJob` have to share one socket. Once they did, the printer reported "TestPrint processing" for about 12 seconds, a nozzle check pattern came out, and the cassette's sheet counter went up by one.

From there the printer explained itself. `GetCapability` for maintenance lists cleaning types `regular`, `deep` and `choke` (an ink flush), and test prints `nozzle_check`, `auto_registration`, `manual_registration` and `regi_check`, all fed from the cassette on A4 or Letter plain paper. Device settings use the same envelope with `GetConfiguration` and `SetConfiguration` under `servicetype="device"`. My printer was set to auto power-off after 240 minutes, auto power-on off, quiet mode off (with a 21:00–07:00 schedule), drying level 3 of 5 and paper gap on auto. Claude Code proved the write path with a no-op first, setting drying level 3 to 3, then switched auto power-on from off to on, and confirmed both by reading them back.

## A Canon G5040 manager for the Mac

With the protocol mapped, the app came together in the same session. G5040 Manager is a local web app on `localhost:4280`, bound to 127.0.0.1 only, because its API can start cleanings and has no login. It runs at login through launchd and restarts if it crashes (three seconds, when I killed it to check).

- **Overview**: status in plain English, ink tanks, paper per tray, sheet counters, and the Mac's own queue state with a "Resume queue" button, because that paused queue is what started all this.
- **Maintenance**: nozzle check, cleaning, deep cleaning, an alignment-check print and automatic head alignment.
- **Settings**: every change is confirmed, written, read back and logged.
- **Diagnostics**: ports, IPP, the Remote UI scripts, the TLS certificate, the printer's clock, the Mac queue.
- **Support codes**: all 95 G5000 codes, stored as the code, a short category in my own words and a link to [Canon's page for it](https://ij.manual.canon/ij/webmanual/ErrorCode/G5000%20series/EN/ERR/err_contents0100.html). Canon's manual site forbids reproducing its text, so I didn't.
- **History**: status changes, raw printer signals, ink over time and every action taken.

The ink flush is deliberately missing. It pushes a lot of ink into the waste-ink absorber, and a full absorber (support codes 1700, 1701 and 5B00) is something only Canon service can fix. The printer offers it. The app doesn't.

The least visible feature is a keep-alive nozzle check. After 7 days without printing, between 09:00 and 21:00 and only when the printer reports ready, the app prints one. Canon advises printing at least monthly, and weekly is what MegaTank owners tend to recommend. "Idle" comes from the printer's own sheet counter, so a print from my phone counts too. This is also why I had to turn auto power-on back on: with auto power-off at 4 hours and auto power-on disabled, the printer is unreachable by the time any keep-alive wants to run.

## Catching every print from the Mac

I also wanted a history of what I'd printed, with a preview and a re-print button. So the app runs its own IPP printer on `127.0.0.1:8631`, and macOS has a second queue, "Canon G5040 (via Manager)", pointing at it, set as the default. Every job from any app is saved with a page-one preview (the last 30 prints, 500 MB at most) and forwarded unchanged to the real printer.

Doing this without breaking printing meant reading the IPP backend in the CUPS source, and every lesson from it went into the proxy:

- macOS's CUPS 2.3.4 has a known problem with `lpadmin -m everywhere` ([OpenPrinting/cups#514](https://github.com/OpenPrinting/cups/issues/514)). The existing queue's driver file was generated by Apple's private `ipp2ppd`, so the new queue reuses a copy of it via `lpadmin -P`.
- macOS doesn't send Print-Job. It sends Validate-Job, then Create-Job followed by a chunked Send-Document.
- The printer aborts a Create-Job whose document takes more than 60 seconds to arrive (`multiple-operation-time-out`), so the proxy spools the whole job to disk first and forwards it as a single Print-Job.
- **Answering `server-error-internal-error` makes CUPS pause the queue**, the exact failure I started with. Refusals are reported as job state "aborted" instead, which CUPS drops without pausing, and "busy" as `server-error-busy`, which it retries. The queue also uses `printer-error-policy=retry-job`.
- Job attributes are copied byte for byte, never decoded and re-encoded, so no type information gets lost on the way through.

The previews meant decoding Apple Raster (URF), which is what macOS sends: a 12-byte file header, a 32-byte page header, then each line as a repeat count followed by PackBits-style runs. An A4 page at 600 dpi is roughly 100 MB of pixels, so the decoder reads one line at a time into a reused buffer and keeps only the lines it needs for a 320-pixel thumbnail:

```js
const repeat = buf[pos++] + 1; // this line is used `repeat` times
let x = 0;
while (x < widthPx) {
  const c = buf[pos++];
  if (c === 128) {          // rest of the line is white
    line.fill(white, x * bytesPerPixel);
    x = widthPx;
  } else if (c > 128) {     // 257 - c literal pixels follow
    const count = 257 - c;
    buf.copy(line, x * bytesPerPixel, pos, pos + count * bytesPerPixel);
    pos += count * bytesPerPixel;
    x += count;
  } else {                  // one pixel, repeated c + 1 times
    for (let i = 0; i <= c; i++) buf.copy(line, (x + i) * bytesPerPixel, pos, pos + bytesPerPixel);
    pos += bytesPerPixel;
    x += c + 1;
  }
}
```

The failure modes are boring on purpose. If the app is down, CUPS holds the job for up to 7 days. If the printer is unreachable, the app retries for 24 hours. The original direct queue still works without any of this.

## macOS papercuts

Two problems had nothing to do with the printer at all.

The first appeared the moment the app ran as a LaunchAgent: every connection to the printer failed with `EHOSTUNREACH`. The same Node binary, started from a terminal, worked fine. The cause is **macOS Local Network privacy**, which blocks background processes from reaching the LAN until you approve them. The fix is a toggle for `node` under System Settings → Privacy & Security → Local Network. The error message gives no hint that a permission is involved.

The second was notifications. `osascript -e 'display notification …'` is silently dropped on macOS 26, because the notification gets attributed to Script Editor, and the command still exits 0 ([Apple's developer forums have the thread](https://developer.apple.com/forums/thread/808496)). Claude Code replaced it with a tiny native app, G5040 Manager.app: about 50 lines of Swift, ad-hoc signed, using `UNUserNotificationCenter`. It posts notifications under its own name, opening it opens the web UI, and its icon is the printer's own image, served by the printer. The first idea had been to hook the "printer web page" button in the Mac's printer info dialog, but macOS 26 no longer has one, so the launcher took that job too. Each alert condition fires once, with quiet hours and per-category switches.

## One session, several agents

None of this was planned as a project. It started as "why won't my printer print" and ended, in the same Claude Code session, as a working app with tests. Claude Code (on Opus) drove: it ran the Bonjour and IPP probes, captured the bytes, and wrote the clients and the server. Fable ran as a separate research agent and as a plan reviewer, and a couple of Sonnet helpers took the smaller jobs. I've written before about [splitting work across parallel agents](/claude-code-parallel-agents-feature/), and this is the clearest case I've had for it: the research agent found the cnijfilter2 6.81 change while the main session was still sending BJL into the void. I didn't steer any of that. My whole contribution was answering the handful of questions Claude Code asked along the way.

**The printer was the test oracle.** Every claim got checked against the device: a sheet counter that went up by one, a setting that read back with its new value, a queue that resumed. When `TestPrint` came back `NotStart`, the fix came from that reply, not from a guess. The total paper cost of all the testing was two nozzle checks and three near-blank sheets.

What came out is Node 22 with zero npm dependencies: a hand-written IPP/1.1 encoder and decoder, the CHMP client, the IPP server, the URF decoder and a BMP writer, with `sips` doing image conversion. The front end is plain HTML, CSS and JavaScript with light and dark modes. There are 90 tests on `node:test`, several running against real bytes captured from the printer, with the serial number and MAC addresses swapped for placeholders before anything went public. Mutation checks, breaking the implementation on purpose, confirmed the key tests fail when they should.

"Game-changing" is a word I'd normally cut from a draft. Here it's the accurate one. I went in wanting to know why a PDF wouldn't print, and came out with a reverse-engineered protocol, a fake printer that understands CUPS's failure modes, a native notification helper and 90 tests, all done by Claude Code on its own. That isn't autocomplete. It's handing over a problem I didn't know how to approach and getting back a finished, tested answer.

## What I still don't know

One thing still bothers me. An ink flush started from the printer's own panel showed up in *none* of the status signals: not IPP's printer state, not the Remote UI's busy code, not CHMP's maintenance job info. A roller cleaning started from the same panel shows up fine, as `RollerCleaning`. The app now logs every raw signal whenever it changes, so the next panel flush gets caught in the act.

Next on the list is resetting the ink counter after a refill. It's a single `VendorCmd` `ResetCounter`, fixma-pixma has verified it on a G7020, and the G5040 lists it in its own capabilities. It isn't built yet.

The code is on GitHub at [masimplo/cannon-manager](https://github.com/masimplo/cannon-manager), and yes, the repo name really has the extra "n". If you own a G5000-series MegaTank and a Mac, it should work as is. Other IVEC-era PIXMAs probably speak the same dialect, but I've only tested the one on my desk.

It still won't let me into the Remote UI, though.
