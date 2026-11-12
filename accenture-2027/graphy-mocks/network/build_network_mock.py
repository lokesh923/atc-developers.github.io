"""Build Networking, Security & Cloud mock tests in Graphy Word format (scenario-based MCQs).

Usage: python3 build_network_mock.py ../pseudocode/template8.docx <mock no> <out.docx>
The subnetting answer is recomputed with Python's ipaddress module before the file is written.
"""
import ipaddress
import os
import sys

import docx

HERE = os.path.dirname(os.path.abspath(__file__))
SUBJECT = "Technical Assessment"
TOPIC = "Networking, Security & Cloud"
SEL = " Select the correct answer from the given choices."

# (topic, question, options, right option number, explanation, difficulty)
MOCK_1 = [
    ("OSI model",
     "Assume that Rahul, a network engineer, is troubleshooting why packets from the Pune office cannot reach the "
     "Mumbai office. The cables and switch ports are working, so he now checks the routers and the IP routing "
     "tables. At which layer of the OSI model is he working?" + SEL,
     ["Data Link layer (Layer 2)", "Transport layer (Layer 4)", "Network layer (Layer 3)", "Session layer (Layer 5)"], 3,
     "Routers and IP addressing/routing work at the Network layer (Layer 3). Switches and MAC addresses are Layer 2, "
     "TCP/UDP ports are Layer 4.", "Easy"),
    ("TCP/IP model",
     "Consider that a team is building a live video-calling application. A few lost packets are acceptable, but "
     "the video must play with the lowest possible delay. Which transport-layer protocol is most suitable?" + SEL,
     ["UDP, because it is connectionless and does not wait to resend lost packets",
      "TCP, because it guarantees that every packet arrives in order",
      "ICMP, because it is used to carry application data",
      "ARP, because it maps IP addresses to MAC addresses"], 1,
     "UDP has no handshake and no retransmission, so it gives low latency; real-time voice and video use it. TCP "
     "is reliable but adds delay by resending lost packets. ICMP is for error and diagnostic messages, and ARP "
     "resolves MAC addresses.", "Easy"),
    ("IP addressing",
     "Assume that a server is configured with the IP address 192.168.10.77 and subnet mask /27 "
     "(255.255.255.224). What are the network address and the broadcast address of its subnet?" + SEL,
     ["Network 192.168.10.0, broadcast 192.168.10.255", "Network 192.168.10.64, broadcast 192.168.10.95",
      "Network 192.168.10.72, broadcast 192.168.10.79", "Network 192.168.10.77, broadcast 192.168.10.127"], 2,
     "/27 leaves 5 host bits, so each subnet has 2^5 = 32 addresses: 0–31, 32–63, 64–95, ... 77 falls in 64–95. "
     "The first address (192.168.10.64) is the network address, the last (192.168.10.95) is the broadcast "
     "address, and 30 addresses (65–94) are usable for hosts.", "Medium"),
    ("DNS",
     "Consider that an employee cannot open www.example.com in any browser, but the same website opens when she "
     "types its IP address directly. Other internet services are working. Which service is most likely failing?" + SEL,
     ["DHCP", "DNS", "NAT", "SMTP"], 2,
     "DNS translates domain names into IP addresses. If the site works by IP but not by name, name resolution is "
     "failing (wrong or unreachable DNS server). DHCP assigns addresses, NAT translates private to public "
     "addresses, and SMTP sends email.", "Easy"),
    ("DHCP",
     "Assume that a new laptop joins the office Wi-Fi and receives its IP address, subnet mask, gateway and DNS "
     "server automatically from a DHCP server. In which order are the DHCP messages exchanged?" + SEL,
     ["Request → Offer → Discover → Acknowledge", "Offer → Discover → Acknowledge → Request",
      "Discover → Request → Offer → Acknowledge", "Discover → Offer → Request → Acknowledge"], 4,
     "DHCP uses the DORA process: the client broadcasts Discover, the server sends an Offer, the client sends a "
     "Request for that offer, and the server confirms with an Acknowledge.", "Medium"),
    ("HTTP / HTTPS",
     "Consider that an online banking website must make sure that passwords and account details cannot be read "
     "by anyone intercepting the traffic between the browser and the server. Which option provides this?" + SEL,
     ["HTTPS, which encrypts HTTP traffic with TLS and normally uses port 443",
      "HTTP on port 80, which compresses the traffic",
      "FTP on port 21, which transfers files securely",
      "Telnet on port 23, which provides a secure remote login"], 1,
     "HTTPS is HTTP inside a TLS-encrypted connection (default port 443); the server's certificate also proves its "
     "identity. Plain HTTP (80), FTP (21) and Telnet (23) send data, including passwords, in clear text.",
     "Easy"),
    ("Firewalls",
     "Assume that a company firewall must allow replies to connections that internal users start (for example, "
     "web pages they request), but block any new connection that an outside host tries to open. Which firewall "
     "feature does this?" + SEL,
     ["Static packet filtering that checks each packet on its own",
      "Port forwarding of all inbound traffic",
      "Stateful inspection, which tracks active connections and allows matching return traffic",
      "MAC address filtering on the switch"], 3,
     "A stateful firewall keeps a connection-state table. Return packets that belong to a connection started from "
     "inside are allowed; unsolicited inbound connection attempts are dropped. A static packet filter judges each "
     "packet alone, so it cannot tell a reply from a new attack.", "Medium"),
    ("VPN",
     "Consider that a company has a head office in Delhi and a branch office in Chennai. It wants both office "
     "networks to be connected permanently and securely over the public internet, without every employee "
     "starting a VPN client. Which solution fits best?" + SEL,
     ["A remote-access VPN installed on every employee's laptop", "A site-to-site VPN between the two office gateways",
      "A proxy server in each office", "A public Wi-Fi hotspot shared by both offices"], 2,
     "A site-to-site VPN creates an always-on encrypted tunnel between two networks (router to router or firewall "
     "to firewall), so users need no client. A remote-access VPN connects individual users to the network.",
     "Medium"),
    ("Encryption basics",
     "Assume that a development team must store user passwords in a database so that even an administrator who "
     "reads the database cannot recover the original passwords. Which approach is most appropriate?" + SEL,
     ["Encrypt each password with AES and keep the key in the same database",
      "Store passwords in Base64 encoding",
      "Store passwords in plain text inside a hidden column",
      "Store a salted hash of each password using a slow hashing algorithm such as bcrypt"], 4,
     "Hashing is one-way: the system hashes the entered password and compares hashes, so the original never needs "
     "to be stored. A unique salt defeats precomputed (rainbow table) attacks, and a slow algorithm makes guessing "
     "expensive. Encryption is reversible with the key, and Base64 is only an encoding.", "Medium"),
    ("Malware types",
     "Consider that a malicious program spreads automatically from one computer to another across the company "
     "network by exploiting a vulnerability, without any user opening a file or clicking a link. What type of "
     "malware is this?" + SEL,
     ["Worm", "Trojan horse", "Spyware", "Adware"], 1,
     "A worm is self-replicating and spreads on its own over networks. A Trojan pretends to be useful software "
     "and needs a user to run it; spyware secretly collects information; adware shows unwanted advertisements.",
     "Easy"),
    ("Cloud service models",
     "Assume that a start-up's developers want to deploy their web application code directly to the cloud. They "
     "do not want to manage servers, operating systems or runtime updates, but they still want full control of "
     "their application and data. Which cloud service model should they choose?" + SEL,
     ["Infrastructure as a Service (IaaS)", "Software as a Service (SaaS)", "Platform as a Service (PaaS)",
      "On-premises hosting"], 3,
     "PaaS provides a managed platform (OS, runtime, scaling); the customer manages only the application and data, "
     "e.g. Azure App Service, Google App Engine, Heroku. IaaS still leaves the OS to the customer, and SaaS is "
     "ready-made software with no code of your own.", "Easy"),
    ("Cloud deployment models",
     "Consider that a hospital keeps patient records on its own private cloud for compliance, but runs its public "
     "appointment website on a public cloud, and the two environments are connected and share data. Which "
     "deployment model is this?" + SEL,
     ["Community cloud", "Hybrid cloud", "Public cloud", "Private cloud"], 2,
     "A hybrid cloud combines a private cloud (or on-premises systems) with a public cloud, connected so that data "
     "and applications can move between them. A community cloud is shared by several organisations with common "
     "needs.", "Easy"),
    ("DevOps: Git and CI/CD",
     "Assume that five developers work on separate features at the same time. They want to merge their work "
     "safely, and every merge into the main branch must automatically build the code and run the tests. Which "
     "practice should the team follow?" + SEL,
     ["All developers edit the same files directly on the production server",
      "Developers email their code to a lead, who copies it manually",
      "Developers work only on the main branch and test once a month",
      "Feature branches in Git, merged through pull requests, with a Continuous Integration pipeline"], 4,
     "Git branches isolate each feature; pull requests allow review before merging. Continuous Integration (for "
     "example GitHub Actions or Jenkins) builds and tests automatically on every merge, so problems are found "
     "early. Continuous Delivery/Deployment then releases the tested build.", "Medium"),
    ("DevOps: Docker",
     "Consider that an application works on a developer's laptop but fails on the test server because of "
     "different library versions. The team wants a lightweight way to package the application with all its "
     "dependencies so that it runs the same everywhere, starting in seconds. Which technology fits best?" + SEL,
     ["A separate physical server for each environment", "A Docker container built from a Docker image",
      "A full virtual machine with its own guest operating system for every service", "A shared network drive"], 2,
     "A Docker image bundles the application with its libraries and runtime; containers share the host operating "
     "system's kernel, so they are lighter and start faster than virtual machines, which each run a full guest OS.",
     "Easy"),
]

MOCKS = {1: MOCK_1}


def verify():
    net = ipaddress.ip_interface("192.168.10.77/27").network
    expected = f"Network {net.network_address}, broadcast {net.broadcast_address}"
    q = MOCK_1[2]
    assert q[2][q[3] - 1] == expected, (q[2][q[3] - 1], expected)
    assert net.num_addresses - 2 == 30
    for m in MOCKS.values():
        for t, text, opts, right, expl, diff in m:
            assert 1 <= right <= 4 and len(set(opts)) == 4, t


def build(template, mock_no, out):
    verify()
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    qs = MOCKS[mock_no]
    for n, (topic, text, opts, right, expl, diff) in enumerate(qs, 1):
        tags = f"accenture, technical assessment, networking security cloud, {topic.lower()}, mock test {mock_no}, {diff.lower()}"
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}", f"{{TOPIC}} {TOPIC}",
                     f"{{TAGS}} {tags}", "{QUESTION TYPE} SINGLECORRECT", f"{{QUESTION TEXT}} {text}", ""]:
            d.add_paragraph(line)
        for i in range(10):
            d.add_paragraph(f"{{OPTION {i + 1}}} {opts[i] if i < len(opts) else ''}".rstrip())
        for line in [f"{{RIGHT ANSWER}} {right}", f"{{EXPLANATION}} {expl}", "{CORRECT MARKS} 1",
                     "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {diff}", "{QUESTION ENDS}", "", ""]:
            d.add_paragraph(line)
    d.save(out)
    from collections import Counter
    print("answer positions:", Counter(q[3] for q in qs))
    return len(qs)


if __name__ == "__main__":
    print("wrote", build(sys.argv[1], int(sys.argv[2]), sys.argv[3]), "questions to", sys.argv[3])
