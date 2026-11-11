"""Build the detailed Networking, Security & Cloud guide (Technical Assessment, Part C).

Subnetting MCQs are computed with Python's ipaddress module and asserted against the key.
Usage: python3 build_network_guide.py <base_style.html> <out.html>
"""
import html
import ipaddress as ip
import random
import sys

rng = random.Random(14)
LET = "ABCD"

def net(s): return ip.ip_network(s, strict=False)
def hosts(prefix): return 2 ** (32 - prefix) - 2

SUBNET = [  # (question, computed answer, wrong options, why)
    ("How many <b>usable host</b> addresses are in a <code>/27</code> subnet?", str(hosts(27)), ["32", "27", "62"],
     "Host bits = 32 − 27 = 5, and 2⁵ − 2 = 30. The network and broadcast addresses aren't usable."),
    ("What is the <b>network address</b> of host <code>192.168.10.77/26</code>?", str(net("192.168.10.77/26").network_address), ["192.168.10.0", "192.168.10.76", "192.168.10.128"],
     "A /26 makes blocks of 64: .0, .64, .128 and .192. 77 falls in the .64 block."),
    ("What is the <b>broadcast address</b> of <code>172.16.5.130/25</code>?", str(net("172.16.5.130/25").broadcast_address), ["172.16.5.127", "172.16.5.128", "172.16.255.255"],
     "A /25 makes blocks of 128. 130 is in the .128 block, so its broadcast is the last address, .255."),
    ("What is the subnet mask for prefix <code>/28</code>?", str(net("0.0.0.0/28").netmask), ["255.255.255.248", "255.255.255.224", "255.255.240.0"],
     "28 ones: 255.255.255 + 11110000₂ (240)."),
    ("What is the <b>last usable host</b> in <code>10.1.1.0/29</code>?", str(list(net("10.1.1.0/29").hosts())[-1]), ["10.1.1.7", "10.1.1.8", "10.1.1.5"],
     "A /29 has 8 addresses: .0 (network), .1–.6 (hosts) and .7 (broadcast)."),
    ("How many <code>/26</code> subnets fit in one <code>/24</code> network?", str(len(list(net("192.168.1.0/24").subnets(new_prefix=26)))), ["2", "64", "6"],
     "You borrow 2 bits (26 − 24), and 2² = 4 subnets of 64 addresses each."),
    ("Which address is in the same subnet as <code>192.168.1.70/27</code>?", next(a for a in ["192.168.1.90", "192.168.1.60", "192.168.1.100", "192.168.1.30"] if ip.ip_address(a) in net("192.168.1.70/27")),
     ["192.168.1.60", "192.168.1.100", "192.168.1.30"],
     "A /27 makes blocks of 32. .70 is in .64–.95, and only .90 falls in that range."),
    ("<code>172.20.14.9</code> is a:", "Private IPv4 address" if ip.ip_address("172.20.14.9").is_private else "Public IPv4 address",
     ["Public IPv4 address", "Loopback address", "Multicast address"],
     "172.16.0.0 to 172.31.255.255 is a private range (RFC 1918)."),
]
for q, a, w, _ in SUBNET:
    assert a not in w and len(set(w)) == 3, (q, a)

NETWORK = [
    ("In which topology is every device connected to every other device?", ["Mesh", "Star", "Bus", "Ring"], "A full mesh of n devices needs n(n−1)/2 links. It's very reliable but expensive."),
    ("How many links does a full mesh of 6 devices need?", ["15", "30", "12", "6"], "n(n−1)/2 = 6 × 5 / 2 = 15."),
    ("Communication that goes in both directions, but only one at a time (like a walkie-talkie), is:", ["Half duplex", "Full duplex", "Simplex", "Multiplex"], "Simplex is one direction only (a keyboard or TV broadcast). Full duplex is both directions at once (a phone call)."),
    ("Which OSI layer does encryption, compression and data formatting?", ["Presentation (6)", "Session (5)", "Application (7)", "Transport (4)"], "Layer 6 translates the data format."),
    ("The data unit at the Data Link layer is called a:", ["Frame", "Packet", "Segment", "Bit"], "L4 = segment, L3 = packet, L2 = frame, L1 = bits."),
    ("Which device separates BROADCAST domains?", ["Router", "Switch", "Hub", "Repeater"], "Switches separate collision domains, routers separate broadcast domains, and hubs separate neither."),
    ("Which protocol finds the MAC address for a known IP address?", ["ARP", "DNS", "DHCP", "ICMP"], "ARP (Address Resolution Protocol). DNS resolves names to IPs."),
    ("A MAC address is how long?", ["48 bits", "32 bits", "64 bits", "128 bits"], "48 bits, written as 6 hex pairs. The first 24 bits (the OUI) identify the manufacturer."),
    ("IPv6 addresses are how long?", ["128 bits", "64 bits", "32 bits", "256 bits"], "Written as 8 groups of 4 hex digits. :: compresses consecutive zero groups, and can be used only once."),
    ("Which of these does IPv6 NOT have?", ["Broadcast addresses", "Multicast addresses", "Anycast addresses", "Unicast addresses"], "IPv6 replaces broadcast with multicast."),
    ("What is the correct order of the TCP 3-way handshake?", ["SYN → SYN-ACK → ACK", "ACK → SYN → FIN", "SYN → ACK → SYN-ACK", "FIN → ACK → SYN"], "Connection teardown uses FIN and ACK (4 steps)."),
    ("Which transport protocol do DNS queries normally use?", ["UDP (port 53)", "TCP (port 80)", "UDP (port 67)", "TCP (port 25)"], "DNS uses UDP 53 for normal queries and TCP 53 for zone transfers and large responses."),
    ("SSH runs on which port?", ["22", "23", "21", "25"], "21 = FTP, 22 = SSH, 23 = Telnet (unencrypted), 25 = SMTP."),
    ("Which protocol is used to RETRIEVE email while keeping it synced on the server?", ["IMAP", "SMTP", "POP3", "SNMP"], "SMTP sends mail. POP3 downloads it (and usually deletes it from the server). IMAP keeps it synced on the server."),
    ("HTTP status 301 means:", ["Moved permanently (redirect)", "Unauthorized", "Server error", "Created"], "401 = unauthorized, 5xx = server errors, 201 = created."),
    ("Which HTTP method is meant for creating a new resource?", ["POST", "GET", "DELETE", "HEAD"], "GET reads, POST creates, PUT replaces, PATCH partially updates, DELETE removes."),
    ("Which DNS record maps a domain name to an IPv4 address?", ["A", "AAAA", "MX", "CNAME"], "AAAA is for IPv6, MX for mail servers, and CNAME for aliases."),
    ("The DHCP process in order is:", ["Discover, Offer, Request, Acknowledge", "Request, Offer, Discover, Acknowledge", "Offer, Discover, Acknowledge, Request", "Discover, Request, Offer, Acknowledge"], "Remember DORA."),
    ("RIP considers a route unreachable at a hop count of:", ["16", "15", "255", "8"], "RIP's maximum usable hop count is 15. OSPF is link-state, and BGP routes between autonomous systems (the internet)."),
    ("Which Wi-Fi security protocol is the newest and strongest?", ["WPA3", "WPA2", "WEP", "WPA"], "WEP is broken. WPA2 uses AES, and WPA3 adds SAE."),
]
SECURITY = [
    ("Ensuring data is not altered in transit is which part of the CIA triad?", ["Integrity", "Confidentiality", "Availability", "Authentication"], "Hashes and digital signatures protect integrity."),
    ("Verifying WHO a user is, is called:", ["Authentication", "Authorization", "Accounting", "Auditing"], "Authorization decides what they can do. Accounting logs what they did (together, AAA)."),
    ("A password plus an OTP sent to your phone is an example of:", ["Multi-factor authentication", "Single sign-on", "Biometrics", "Role-based access"], "Something you KNOW plus something you HAVE."),
    ("Which algorithm is asymmetric?", ["RSA", "AES", "DES", "3DES"], "RSA uses a public/private key pair. The others use one shared key."),
    ("Hashing is used to store passwords because it is:", ["One-way (it can't be reversed)", "Fast to decrypt", "Symmetric", "Compressed"], "Add a unique salt to each password to defeat rainbow tables."),
    ("Base64 is:", ["Encoding, not encryption", "Strong encryption", "A hash function", "A digital signature"], "Anyone can decode Base64. It only changes the representation."),
    ("A digital signature is created with the sender's:", ["Private key", "Public key", "Session key", "Password"], "Anyone verifies it with the sender's public key. That gives authenticity, integrity and non-repudiation."),
    ("Malware that spreads across networks BY ITSELF, without a host file, is a:", ["Worm", "Virus", "Trojan", "Rootkit"], "A virus needs a host file and a user action."),
    ("Malware disguised as useful software is a:", ["Trojan", "Worm", "Adware", "Botnet"], "Named after the Trojan horse."),
    ("A targeted phishing attack on a company's CEO or senior executives is called:", ["Whaling", "Vishing", "Smishing", "Baiting"], "Vishing uses voice calls and smishing uses SMS."),
    ("An attacker follows an employee through a secure door without a badge. This is:", ["Tailgating", "Pretexting", "Spoofing", "Sniffing"], "A physical social-engineering attack."),
    ("Thousands of infected devices flood a website so real users can't reach it. This is:", ["DDoS", "MITM", "SQL injection", "Brute force"], "Distributed Denial of Service, often launched from a botnet."),
    ("Injecting malicious JavaScript into a web page that other users view is:", ["Cross-Site Scripting (XSS)", "CSRF", "SQL injection", "Session fixation"], "Prevent it with output encoding and input validation."),
    ("The best defence against SQL injection is:", ["Parameterised queries / prepared statements", "Using HTTPS", "Strong passwords", "A bigger database"], "They keep data separate from the SQL code."),
    ("Which device DETECTS and also BLOCKS malicious traffic inline?", ["IPS", "IDS", "Hub", "Proxy cache"], "An IDS only detects and alerts. An IPS prevents."),
    ("A network zone holding public-facing servers, isolated from the internal LAN, is a:", ["DMZ", "VLAN trunk", "VPN", "Honeypot"], "Demilitarised zone. Web and mail servers often sit there."),
    ("A firewall that tracks the state of connections is:", ["Stateful", "Packet-filtering (stateless)", "Circuit-free", "Static NAT"], "A WAF protects web apps (Layer 7). A next-generation firewall (NGFW) adds application awareness and IPS."),
    ("Testing a system with FULL knowledge of its internals is:", ["White-box testing", "Black-box testing", "Grey-box testing", "Fuzzing only"], "Black box means no knowledge. Grey box means partial knowledge."),
]
CLOUD = [
    ("Which is NOT one of NIST's 5 essential cloud characteristics?", ["Fixed long-term hardware contracts", "On-demand self-service", "Rapid elasticity", "Measured service"], "The 5 are: on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service."),
    ("In PaaS, the CUSTOMER manages:", ["Applications and data", "Physical servers", "The hypervisor", "Networking hardware"], "The provider manages everything up to the runtime and OS."),
    ("AWS Lambda / Azure Functions are examples of:", ["FaaS (serverless)", "IaaS", "SaaS", "On-premise"], "You upload functions, they run on events, and you pay per execution."),
    ("Google Workspace, Salesforce and Zoom are examples of:", ["SaaS", "PaaS", "IaaS", "FaaS"], "Ready-to-use software delivered over the internet."),
    ("Moving from buying servers to paying monthly for cloud usage shifts spending from:", ["CapEx to OpEx", "OpEx to CapEx", "OpEx to OpEx", "CapEx to CapEx"], "CapEx is capital expenditure (upfront). OpEx is operational expenditure (pay as you go)."),
    ("Adding MORE servers to handle load is:", ["Horizontal scaling (scale out)", "Vertical scaling (scale up)", "Virtualisation", "Caching"], "Vertical scaling means a bigger machine."),
    ("VMware ESXi and Microsoft Hyper-V are:", ["Type 1 (bare-metal) hypervisors", "Type 2 (hosted) hypervisors", "Container engines", "Load balancers"], "Type 2 hypervisors run on a host OS (VirtualBox, VMware Workstation)."),
    ("Compared with VMs, containers:", ["Share the host OS kernel and start faster", "Each include a full guest OS", "Need a type 1 hypervisor", "Can't run on Linux"], "This makes them lightweight and portable."),
    ("Amazon S3 / Azure Blob Storage are examples of:", ["Object storage", "Block storage", "File storage", "Relational databases"], "Block storage is like a disk (EBS). File storage is a shared file system (EFS)."),
    ("A network of edge servers that caches content close to users is a:", ["CDN", "VPN", "VPC", "NAS"], "Examples: CloudFront, Azure CDN, Cloudflare."),
    ("Which SDLC model completes each phase fully before the next, with no going back?", ["Waterfall", "Agile", "Spiral", "Iterative"], "Spiral is risk-driven. Agile works in short iterations."),
    ("In Scrum, a fixed time-box (usually 1–4 weeks) to deliver an increment is a:", ["Sprint", "Epic", "Backlog", "Stand-up"], "Roles: Product Owner, Scrum Master, Developers."),
    ("In Continuous Integration, every code change:", ["Is merged often and automatically built and tested", "Goes straight to production without tests", "Is reviewed only at the end of the project", "Must be emailed to the tester"], "CD (Continuous Delivery/Deployment) automates the release."),
    ("Which Git command moves changes into the staging area?", ["git add", "git commit", "git push", "git stash"], "Working directory → (add) → staging → (commit) → local repo → (push) → remote."),
    ("<code>git pull</code> is equivalent to:", ["git fetch + git merge", "git clone + git push", "git add + git commit", "git branch + git checkout"], "git fetch only downloads and doesn't merge."),
    ("In a Dockerfile, which instruction sets the BASE image?", ["FROM", "RUN", "CMD", "EXPOSE"], "RUN runs at build time, CMD is the default command at run time, and EXPOSE documents a port."),
    ("The smallest deployable unit in Kubernetes is a:", ["Pod", "Node", "Cluster", "Namespace"], "A pod holds one or more containers. A node is a machine. A cluster is a set of nodes."),
    ("Writing infrastructure as version-controlled code (for example with Terraform) is called:", ["Infrastructure as Code (IaC)", "Serverless", "Containerisation", "Virtualisation"], "Ansible, Chef and Puppet handle configuration management."),
]

def esc(s): return html.escape(s, quote=False)

def render(num, qhtml, opts):
    order = list(range(4)); rng.shuffle(order); shown = [opts[i] for i in order]
    li = "".join(f"<li><b>{LET[i]}</b> {o}</li>" for i, o in enumerate(shown))
    return f'<div class="mcq"><div class="qn">{num}</div><div class="qb"><div class="qt">{qhtml}</div><ol class="opts">{li}</ol></div></div>', LET[order.index(0)]

def bank(prefix, items, tag):
    qs, keys = [], []
    for i, (q, opts, why) in enumerate(items, 1):
        assert len(set(opts)) == 4, q
        h, a = render(f"{prefix}{i}", f"<span class='tg'>{tag}</span>{q}", opts)
        qs.append(h); keys.append((f"{prefix}{i}", a, opts[0], why))
    return "".join(qs), keys

def key_html(keys):
    rows = "".join(f"<tr><td><b>{n}</b></td><td class='ans'>{a}</td><td>{c}</td><td>{w}</td></tr>" for n, a, c, w in keys)
    return f"<table class='keyt'><thead><tr><th>Q</th><th>Ans</th><th>Correct</th><th>Why</th></tr></thead><tbody>{rows}</tbody></table>"

def main(base, out):
    style = open(base).read()
    d = __file__.rsplit("/", 1)[0]
    t0 = open(f"{d}/tech_0.html").read(); tech_style = t0[t0.index("<style>"):t0.index("</style>") + 8]
    doc = open(f"{d}/network_template.html").read()
    sq, sk = bank("S", [(q, [a] + w, why) for q, a, w, why in SUBNET], "Subnetting")
    nq, nk = bank("N", NETWORK, "Networking")
    xq, xk = bank("X", SECURITY, "Security")
    cq, ck = bank("C", CLOUD, "Cloud &amp; DevOps")
    total = len(sk) + len(nk) + len(xk) + len(ck)
    doc = (doc.replace("<!--BASE_STYLE-->", style + tech_style)
              .replace("<!--MCQ_N-->", sq + nq).replace("<!--KEY_N-->", key_html(sk + nk))
              .replace("<!--MCQ_X-->", xq).replace("<!--KEY_X-->", key_html(xk))
              .replace("<!--MCQ_C-->", cq).replace("<!--KEY_C-->", key_html(ck))
              .replace("<!--TOTAL_MCQ-->", str(total)))
    open(out, "w").write(doc)
    print("ok", out, "| MCQs:", total, "| subnet answers:", [a for _, a, _, _ in SUBNET])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
