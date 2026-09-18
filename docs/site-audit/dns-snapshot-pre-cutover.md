# brianmueller.com — pre-cutover DNS snapshot

Captured 2026-09-18T16:58:53Z, before any production change. This is the rollback record: if the
cutover has to be reversed, these are the values that were live beforehand.

```
NS      dns1.p07.nsone.net. dns2.p07.nsone.net. dns3.p07.nsone.net. dns4.p07.nsone.net. 
A   @   198.49.23.144 198.49.23.145 198.185.159.144 198.185.159.145 
CNAME www ext-sq.squarespace.com. 
A   www 198.49.23.145 198.185.159.144 198.185.159.145 198.49.23.144 
MX      10 mx10.antispam.mailspamprotection.com. 20 mx20.antispam.mailspamprotection.com. 30 mx30.antispam.mailspamprotection.com. 
TXT     "v=spf1 +a +mx include:brianmueller.com.spf.auto.dnssmarthost.net ~all" 
A   *   35.190.31.54 35.227.194.51 34.149.120.3 34.160.17.71    (wildcard)
CAA        (none)
DMARC      (none)
```

Serving today: `brianmueller.com` 301s to `www.brianmueller.com`, which answers 200 from
`Server: Squarespace`.
