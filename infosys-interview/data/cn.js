IV.addModule({ id: 'cn', group: 'tech', title: 'Computer networks', blurb: 'OSI and TCP/IP models, IP addressing and subnetting, TCP vs UDP, DNS, HTTP and HTTPS, common protocols, devices and what happens when you open a website.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is a computer network? What are LAN, MAN and WAN?', a: `A computer network is a group of devices connected to **share data and resources** (files, printers, internet).

- **LAN (Local Area Network):** a small area such as a home, office or campus. High speed, privately owned.
- **MAN (Metropolitan Area Network):** a city-wide network, connecting several LANs.
- **WAN (Wide Area Network):** a large geographical area, countries or continents. The **Internet** is the largest WAN.
- **PAN:** personal devices over a few metres (Bluetooth).` },
{ lvl: 'basic', hot: true, tags: ['models'], q: 'Explain the 7 layers of the OSI model.', a: `| # | Layer | Job | Examples / unit |
| --- | --- | --- | --- |
| 7 | Application | Services used by applications | HTTP, FTP, SMTP, DNS |
| 6 | Presentation | Format, encryption, compression | SSL/TLS, JPEG, ASCII |
| 5 | Session | Open, manage and close sessions | NetBIOS, RPC |
| 4 | Transport | End-to-end delivery, ports, reliability | TCP, UDP, **segment** |
| 3 | Network | Logical addressing and routing | IP, ICMP, routers, **packet** |
| 2 | Data link | Delivery on the same network, MAC addresses, error detection | Ethernet, switches, **frame** |
| 1 | Physical | Bits on the medium | Cables, hubs, signals, **bits** |

A memory trick from the top: **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing. From the bottom: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.` },
{ lvl: 'basic', hot: true, tags: ['models'], q: 'What is the TCP/IP model? How is it different from OSI?', a: `TCP/IP is the practical model the Internet uses, with **4 layers**:

| TCP/IP layer | OSI layers it covers | Protocols |
| --- | --- | --- |
| Application | Application, Presentation, Session | HTTP, FTP, SMTP, DNS, DHCP |
| Transport | Transport | TCP, UDP |
| Internet | Network | IP, ICMP, ARP |
| Network access (link) | Data link, Physical | Ethernet, Wi-Fi |

OSI is a **reference model** with 7 layers and strict separation. TCP/IP was built **around protocols** that are actually used, has 4 layers and is the real standard.` },
{ lvl: 'basic', hot: true, tags: ['transport'], q: 'TCP vs UDP: differences and examples.', a: `| | TCP | UDP |
| --- | --- | --- |
| Connection | Connection-oriented (3-way handshake) | Connectionless |
| Reliability | Reliable: acknowledgements, retransmission, ordered delivery | Unreliable: no guarantee, no order |
| Speed | Slower (overhead) | Faster, lightweight |
| Flow / congestion control | Yes | No |
| Header | 20 bytes or more | 8 bytes |
| Used for | Web (HTTP/HTTPS), email, file transfer, SSH | Video/voice calls, live streaming, online games, DNS queries |` },
{ lvl: 'medium', hot: true, tags: ['transport'], q: 'Explain the TCP three-way handshake and how a connection is closed.', a: `**Connection setup:**
1. **SYN:** the client sends a segment with the SYN flag and an initial sequence number.
2. **SYN-ACK:** the server replies acknowledging it and sends its own sequence number.
3. **ACK:** the client acknowledges. The connection is established.

**Connection termination** uses a four-step exchange: FIN from one side, ACK from the other, then FIN from the other side and a final ACK. Each direction is closed separately.` },
{ lvl: 'basic', hot: true, tags: ['ip'], q: 'What is an IP address? IPv4 vs IPv6. What is a private IP?', a: `An IP address is the **logical address** of a device on a network.

- **IPv4:** 32 bits, written as four decimal numbers like \`192.168.1.10\` (about 4.3 billion addresses, now exhausted).
- **IPv6:** 128 bits, written in hexadecimal like \`2001:db8::1\` (an almost unlimited number of addresses).

**Private IP ranges** (not routable on the internet, used inside homes and offices): \`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`. **NAT** lets many private devices share one public IP.` },
{ lvl: 'medium', hot: true, tags: ['ip'], q: 'What are the classes of IPv4 addresses? What is a subnet mask and CIDR?', a: `| Class | First octet | Default mask | Use |
| --- | --- | --- | --- |
| A | 1 - 126 | 255.0.0.0 (/8) | Very large networks |
| B | 128 - 191 | 255.255.0.0 (/16) | Medium networks |
| C | 192 - 223 | 255.255.255.0 (/24) | Small networks |
| D | 224 - 239 | - | Multicast |
| E | 240 - 255 | - | Experimental |

A **subnet mask** says which part of the address is the **network** and which is the **host**. **CIDR** writes it as a prefix length: \`192.168.1.0/24\` means the first 24 bits are the network.` },
{ lvl: 'medium', hot: true, tags: ['ip'], q: 'Solve: how many hosts are possible in the network 192.168.10.0/26?', a: `A /26 mask means **26 network bits and 6 host bits**.

- Total addresses = 2⁶ = **64**.
- Usable hosts = 64 - 2 = **62** (one address is the network address, one is the broadcast address).
- Network address 192.168.10.0, broadcast 192.168.10.63, usable range .1 to .62.
- The mask is 255.255.255.192.

Formula: usable hosts = 2^(host bits) - 2. Number of subnets from a /24 split into /26 = 2² = 4.` },
{ lvl: 'basic', hot: true, tags: ['dns'], q: 'What is DNS and how does it work?', a: `DNS (Domain Name System) is the Internet's **phone book**: it translates a domain name (\`www.infosys.com\`) into an IP address.

Steps: the browser checks its cache -> the OS cache -> asks the **recursive resolver** of the ISP -> the resolver asks a **root server**, then the **TLD server** (.com), then the **authoritative server** of the domain -> the IP address returns and is cached for a time (TTL).

Common record types: **A** (name to IPv4), **AAAA** (IPv6), **CNAME** (alias), **MX** (mail server), **NS** (name server). DNS mostly uses UDP port 53.` },
{ lvl: 'basic', hot: true, tags: ['http'], q: 'What is HTTP? What are the HTTP methods and the status code groups?', a: `HTTP (HyperText Transfer Protocol) is the application-layer protocol of the web, a **request-response** protocol that is **stateless** (each request is independent).

Methods: **GET** (read), **POST** (create), **PUT** (replace/update), **PATCH** (partial update), **DELETE** (remove), HEAD, OPTIONS.

| Code | Meaning | Examples |
| --- | --- | --- |
| 1xx | Informational | 100 Continue |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |` },
{ lvl: 'basic', hot: true, tags: ['http'], q: 'HTTP vs HTTPS. How does HTTPS work?', a: `**HTTPS = HTTP + TLS/SSL.** The data between browser and server is **encrypted**, the server is **authenticated** with a certificate and the data cannot be changed on the way. HTTP uses port 80, HTTPS uses port 443.

Simplified flow: the browser connects and the server sends its **certificate** (signed by a trusted Certificate Authority) -> the browser verifies it -> both sides agree on a **session key** using asymmetric cryptography -> all further data is encrypted with that fast symmetric key.` },
{ lvl: 'medium', hot: true, tags: ['http'], q: 'What happens when you type a URL in the browser and press Enter?', a: `1. The browser checks its cache and **DNS** resolves the domain to an IP address.
2. A **TCP connection** is opened to that IP (three-way handshake), and for HTTPS a **TLS handshake** follows.
3. The browser sends an **HTTP request** (\`GET /\`).
4. The server (often through a load balancer) processes it, may query a database and returns an **HTTP response** with HTML and a status code.
5. The browser parses the HTML, requests CSS, JavaScript and images, builds the page and renders it.

Naming each layer (DNS, TCP, TLS, HTTP, rendering) in order is what interviewers look for.` },
{ lvl: 'basic', tags: ['http'], q: 'What are cookies, sessions and cache? GET vs POST.', a: `HTTP is stateless, so the web adds state:
- **Cookie:** a small piece of data the server asks the browser to store and send back with each request.
- **Session:** data kept **on the server**, identified by a session id stored in a cookie.
- **Cache:** saved copies of responses to avoid downloading them again.

**GET** sends parameters in the URL, is cacheable, should only read and is visible in history. **POST** sends data in the request body, is not cached by default and is used to create or change data, so it suits passwords and forms.` },
{ lvl: 'basic', hot: true, tags: ['devices'], q: 'Hub vs switch vs router. What is a modem and a gateway?', a: `| Device | Layer | What it does |
| --- | --- | --- |
| Hub | 1 | Repeats incoming bits to **all** ports. No intelligence, collisions. |
| Switch | 2 | Learns **MAC addresses** and sends frames only to the right port. |
| Router | 3 | Connects **different networks** and forwards packets using IP addresses and routing tables. |
| Modem | 1 | Converts digital signals to analogue and back for the telephone/cable line. |
| Gateway | Any | A node that connects networks using different protocols (your router is the default gateway to the internet). |` },
{ lvl: 'basic', hot: true, tags: ['addressing'], q: 'MAC address vs IP address. What is ARP?', a: `A **MAC address** is a 48-bit **physical** address burned into the network card (like \`00:1A:2B:3C:4D:5E\`). It identifies the device on a local network and does not change. An **IP address** is a **logical** address assigned to the device, it changes when you move to another network.

**ARP (Address Resolution Protocol)** finds the MAC address that belongs to a known IP address on the local network by broadcasting "who has this IP?". The owner replies with its MAC.` },
{ lvl: 'basic', tags: ['protocols'], q: 'What is DHCP? What is NAT?', a: `**DHCP (Dynamic Host Configuration Protocol)** automatically gives devices an **IP address, subnet mask, gateway and DNS server** when they join a network (the DORA steps: Discover, Offer, Request, Acknowledge).

**NAT (Network Address Translation)** lets many devices with private IPs share **one public IP**. The router rewrites the source address and port of outgoing packets and keeps a table to send the replies back to the right device.` },
{ lvl: 'basic', hot: true, tags: ['protocols'], q: 'Give the well-known port numbers of common protocols.', a: `| Protocol | Port | Transport |
| --- | --- | --- |
| HTTP | 80 | TCP |
| HTTPS | 443 | TCP |
| FTP | 20 (data), 21 (control) | TCP |
| SSH | 22 | TCP |
| Telnet | 23 | TCP |
| SMTP | 25 | TCP |
| DNS | 53 | UDP (TCP for large) |
| DHCP | 67, 68 | UDP |
| POP3 | 110 | TCP |
| IMAP | 143 | TCP |
| MySQL | 3306 | TCP |

Ports 0 to 1023 are well-known ports. A **socket** is the combination of an IP address and a port.` },
{ lvl: 'basic', tags: ['protocols'], q: 'What are FTP, SMTP, POP3, IMAP and Telnet/SSH used for?', a: `- **FTP:** file transfer (not encrypted; use SFTP).
- **SMTP:** **sending** email between servers.
- **POP3:** downloads email to one device and usually deletes it from the server.
- **IMAP:** keeps email on the server and syncs it across many devices.
- **Telnet:** remote login in plain text (insecure). **SSH:** the secure, encrypted replacement.` },
{ lvl: 'medium', tags: ['topology'], q: 'What are network topologies? Compare bus, star, ring and mesh.', a: `A topology is the layout of how devices are connected.

| Topology | Description | Pros | Cons |
| --- | --- | --- | --- |
| Bus | One shared cable | Cheap, simple | One break stops all, collisions |
| Star | Devices connect to a central switch | Easy to add, one failure does not affect others | Central device is a single point of failure |
| Ring | Each device connects to two neighbours | Orderly data flow | One break can stop the ring |
| Mesh | Every device connects to others | Very reliable | Costly, many links |
| Tree / hybrid | Combination | Scalable | Complex |

Star is the most common in offices.` },
{ lvl: 'medium', tags: ['security'], q: 'What is a firewall? What are VPN, proxy and load balancer?', a: `- **Firewall:** a security system that allows or blocks network traffic by rules (IP, port, protocol), hardware or software.
- **VPN (Virtual Private Network):** creates an **encrypted tunnel** over the internet so remote users can safely reach a private network.
- **Proxy server:** an intermediary between client and server. A forward proxy hides the client and can cache or filter; a **reverse proxy** sits in front of servers.
- **Load balancer:** spreads incoming requests across many servers so that no server is overloaded and the service stays available.` },
{ lvl: 'medium', tags: ['security'], q: 'What is encryption? Symmetric vs asymmetric. What is a digital signature?', a: `Encryption converts readable data (plain text) into unreadable data (cipher text) with a key.

- **Symmetric:** the **same key** encrypts and decrypts (AES). Fast, but the key must be shared securely.
- **Asymmetric:** a **public key** encrypts and the matching **private key** decrypts (RSA). Slower, solves the key sharing problem.

A **digital signature** is created with the sender's **private key** and verified with the public key. It proves **who** sent the data and that it was **not altered**. A **hash** (SHA-256) is a one-way fingerprint of data, used to store passwords and check integrity.` },
{ lvl: 'medium', tags: ['transport'], q: 'What are flow control and congestion control in TCP? What is the sliding window?', a: `- **Flow control** stops a fast sender from overwhelming a slow receiver. The receiver advertises its **window size** (how many bytes it can accept) and the sender never sends more than that without an acknowledgement.
- **Congestion control** reduces the sending rate when the **network** is overloaded (slow start, congestion avoidance, fast retransmit).

The **sliding window** lets the sender transmit several segments before waiting for an ACK, which keeps the link busy. The window moves forward as acknowledgements arrive.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is bandwidth, latency, throughput and a packet?', a: `- **Bandwidth:** the maximum data rate of a link (for example 100 Mbps), like the width of a road.
- **Latency:** the delay for data to travel from source to destination (ping time).
- **Throughput:** the data rate you actually get.
- **Packet:** a small unit of data with a header (addresses, control information) and a payload. Large data is split into packets and reassembled at the destination.` },
{ lvl: 'medium', tags: ['routing'], q: 'What is routing? Static vs dynamic routing. Name some routing protocols.', a: `Routing is the process of choosing the path for packets across networks. A router uses a **routing table**.

- **Static routing:** routes are entered manually. Simple and secure for small networks, but does not adapt to failures.
- **Dynamic routing:** routers learn routes automatically and update when the network changes. Protocols: **RIP** (distance vector, hop count), **OSPF** (link state, within an organisation), **BGP** (between organisations, the protocol of the Internet).` },
{ lvl: 'basic', tags: ['basics'], q: 'What is ping and traceroute? What is ICMP?', a: `**ICMP (Internet Control Message Protocol)** carries error and diagnostic messages of IP. **ping** sends ICMP echo requests to check whether a host is reachable and how long the round trip takes. **traceroute** (\`tracert\` on Windows) shows every router (hop) between you and the destination by sending packets with increasing TTL values.` },
{ lvl: 'medium', tags: ['basics'], q: 'What are the error detection techniques? Parity, checksum and CRC.', a: `Data can get corrupted during transmission, so extra bits are added to detect errors.

- **Parity bit:** one extra bit makes the number of 1s even (or odd). Detects any single-bit error, but not all multi-bit errors.
- **Checksum:** the sender adds up the data words and sends the sum, the receiver recomputes it (used in IP, TCP, UDP headers).
- **CRC (Cyclic Redundancy Check):** treats the data as a polynomial and divides it by a fixed generator. Detects burst errors very well. Used in Ethernet frames.` },
{ lvl: 'medium', tags: ['wireless'], q: 'What is Wi-Fi? Differences between Bluetooth, Wi-Fi and cellular networks (4G/5G)?', a: `**Wi-Fi** (IEEE 802.11) gives wireless LAN access within a building or campus, high speed over tens of metres. **Bluetooth** is for very short range (about 10 m), low power connections between personal devices (earphones, keyboards). **Cellular networks** (4G LTE, 5G) cover large areas through base stations and let devices stay connected while moving; 5G offers higher speed, lower latency and many more connected devices.` },
{ lvl: 'medium', tags: ['api'], q: 'What is a REST API? What are sockets? Client-server vs peer-to-peer?', a: `A **REST API** exposes resources over HTTP with URLs and standard methods (GET /users/5, POST /users) and usually exchanges **JSON**. It is stateless: each request carries everything the server needs.

A **socket** is one end of a two-way connection between two programs, identified by IP address and port, used for network programming.

**Client-server:** clients request, a central server provides (web, email). **Peer-to-peer:** every node acts as both client and server and shares resources directly (BitTorrent).` },
] });
