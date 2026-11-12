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

# (topic, format, question, options, right option number, explanation, difficulty)
# Every question uses a different format AND a different topic.
MOCK_1 = [
    ("OSI model", "Direct concept",
     "Which layer of the OSI model is responsible for end-to-end delivery between applications, including "
     "segmentation, flow control and error recovery?",
     ["Network layer", "Data Link layer", "Transport layer", "Presentation layer"], 3,
     "The Transport layer (Layer 4: TCP/UDP) splits data into segments, numbers them, controls flow and "
     "retransmits lost data. The Network layer routes packets between networks; the Data Link layer moves "
     "frames inside one network.", "Easy"),
    ("TCP/IP ports", "Match the following",
     "Match each protocol with its default port number.<br>"
     "P. HTTPS   Q. DNS   R. SSH   S. SMTP<br>"
     "1. 22   2. 25   3. 53   4. 443",
     ["P-4, Q-3, R-1, S-2", "P-4, Q-1, R-3, S-2", "P-3, Q-4, R-2, S-1", "P-2, Q-3, R-1, S-4"], 1,
     "HTTPS = 443, DNS = 53, SSH = 22, SMTP = 25. Other ports worth remembering: HTTP 80, FTP 20/21, Telnet 23, "
     "DHCP 67/68, RDP 3389.", "Medium"),
    ("DevOps: CI/CD", "Assertion – Reason",
     "Assertion (A): In Continuous Integration, every change merged into the shared branch is automatically built "
     "and tested.<br>Reason (R): Integrating small changes frequently helps the team find integration bugs early, "
     "when they are easier to fix.",
     ["A is true but R is false", "A is false but R is true", "Both A and R are false",
      "Both A and R are true, and R is the correct explanation of A"], 4,
     "Both statements are true, and R is the reason CI exists: frequent automated build + test catches conflicts "
     "and broken code soon after they are introduced. Continuous Delivery/Deployment then releases the tested "
     "build.", "Easy"),
    ("IP addressing", "Numerical",
     "How many usable host addresses are available in a single subnet with the mask /26 (255.255.255.192)?",
     ["64", "62", "30", "126"], 2,
     "/26 leaves 32 - 26 = 6 host bits: 2^6 = 64 addresses. Two are reserved (the network address and the "
     "broadcast address), so 64 - 2 = 62 hosts can be used.", "Medium"),
    ("VPN", "Which is NOT",
     "Which of the following is NOT a benefit of using a VPN?",
     ["It encrypts traffic travelling over an untrusted network such as public Wi-Fi",
      "It lets remote employees reach internal company resources securely",
      "It removes viruses and malware that are already on the user's device",
      "It hides the user's traffic contents from the local network provider"], 3,
     "A VPN creates an encrypted tunnel; it protects data in transit and gives secure remote access. It does not "
     "scan or clean the device, so malware already on a laptop is still there. That is the job of antivirus or "
     "endpoint protection.", "Easy"),
    ("HTTP / HTTPS / DNS", "Sequence",
     "A user types https://www.example.com in a browser for the first time. Arrange these steps in the correct "
     "order.<br>1. TLS handshake and certificate check<br>2. DNS lookup of www.example.com<br>"
     "3. Browser sends the HTTP GET request<br>4. TCP three-way handshake with the server on port 443",
     ["4 → 2 → 1 → 3", "2 → 1 → 4 → 3", "2 → 4 → 1 → 3", "1 → 2 → 4 → 3"], 3,
     "The browser first needs the server's IP address (DNS, 2), then opens a TCP connection to port 443 (4), "
     "then sets up encryption with TLS (1), and only then sends the HTTP request inside the encrypted channel (3).",
     "Medium"),
    ("Firewalls and DHCP", "Statements I / II / III",
     "Consider the following statements:<br>I. A stateful firewall keeps track of active connections and allows "
     "the matching return traffic.<br>II. DHCP automatically gives a device its IP address, subnet mask, default "
     "gateway and DNS server.<br>III. A simple packet-filtering firewall can read the contents of HTTPS traffic "
     "without decrypting it.<br>Which of the statements are correct?",
     ["I and II only", "II and III only", "I and III only", "I, II and III"], 1,
     "I is correct (stateful inspection uses a connection table). II is correct (DHCP leases these settings). III "
     "is wrong: HTTPS payloads are encrypted, and a packet filter only sees headers such as IP addresses and "
     "ports.", "Medium"),
    ("Malware types", "Odd one out",
     "Identify the odd one out.",
     ["Trojan horse", "Rootkit", "Proxy server", "Keylogger"], 3,
     "Trojan horse, rootkit and keylogger are all types of malware. A proxy server is a legitimate network "
     "component that forwards requests on behalf of clients (used for filtering, caching and privacy).", "Easy"),
    ("Encryption basics", "Fill in the blank",
     "In asymmetric encryption, a message encrypted with the receiver's ______ key can be decrypted only with the "
     "receiver's private key.",
     ["public", "session", "symmetric", "hash"], 1,
     "Asymmetric (public-key) cryptography uses a key pair: anyone can encrypt with the public key, and only the "
     "owner of the matching private key can decrypt. Examples: RSA, ECC. Symmetric encryption (AES) uses one shared "
     "key.", "Easy"),
    ("Network troubleshooting", "Identify the command from its output",
     "A support engineer runs a command and sees the output below. Which command was run?<br>"
     "Reply from 142.250.183.14: bytes=32 time=14ms TTL=117<br>"
     "Reply from 142.250.183.14: bytes=32 time=13ms TTL=117",
     ["ipconfig", "ping", "nslookup", "netstat"], 2,
     "ping sends ICMP Echo Requests and prints each Echo Reply with the round-trip time and TTL; it tests "
     "reachability and latency. ipconfig shows the local IP settings, nslookup queries DNS, and netstat lists "
     "network connections.", "Easy"),
    ("DevOps: Docker", "Comparison",
     "Which statement correctly compares Docker containers with virtual machines (VMs)?",
     ["Containers include a full guest operating system, so they are heavier than VMs",
      "VMs share the host kernel, so they start faster than containers",
      "Containers share the host operating system's kernel, so they are lighter and start faster than VMs",
      "Containers and VMs cannot run on the same physical server"], 3,
     "A VM runs a full guest OS on a hypervisor; a container packages only the application and its dependencies "
     "and shares the host kernel. Containers therefore use less memory and start in seconds, which is why Docker "
     "is used for consistent, portable deployments.", "Medium"),
    ("Cloud service models", "Identify from examples",
     "Gmail, Microsoft 365 and Salesforce CRM are examples of which cloud service model?",
     ["Infrastructure as a Service (IaaS)", "Software as a Service (SaaS)", "Platform as a Service (PaaS)",
      "Function as a Service (FaaS)"], 2,
     "SaaS delivers complete, ready-to-use applications over the internet; the provider manages everything. "
     "IaaS examples: AWS EC2, Azure VMs. PaaS examples: Google App Engine, Azure App Service. FaaS examples: AWS "
     "Lambda.", "Easy"),
    ("DevOps: Git", "Command",
     "A developer is on the main branch and wants to bring the completed changes from a branch named feature-login "
     "into main. Which Git command does this?",
     ["git clone feature-login", "git init feature-login", "git stash feature-login", "git merge feature-login"], 4,
     "git merge <branch> combines the named branch into the current branch. git clone copies a repository, "
     "git init creates a new one, and git stash temporarily shelves uncommitted changes.", "Easy"),
    ("Cloud deployment models", "Scenario",
     "Several state government departments need a cloud that is shared only among them, because they follow the "
     "same security and compliance rules. Costs are split between the departments. Which deployment model fits?",
     ["Community cloud", "Public cloud", "Hybrid cloud", "Private cloud"], 1,
     "A community cloud is shared by a group of organisations with common requirements (security, compliance, "
     "mission). A private cloud serves one organisation, a public cloud is open to everyone, and a hybrid cloud "
     "combines private and public.", "Medium"),
]

MOCKS = {1: MOCK_1}


def verify():
    net = ipaddress.ip_network("10.0.0.0/26")
    q = MOCK_1[3]
    assert q[3][q[4] - 1] == str(net.num_addresses - 2), "usable hosts"
    ports = {"HTTPS": 443, "DNS": 53, "SSH": 22, "SMTP": 25}
    q = MOCK_1[1]
    key = dict(x.split("-") for x in q[3][q[4] - 1].split(", "))
    nums = {"1": 22, "2": 25, "3": 53, "4": 443}
    assert {"P": "HTTPS", "Q": "DNS", "R": "SSH", "S": "SMTP"} and all(
        nums[key[l]] == ports[n] for l, n in {"P": "HTTPS", "Q": "DNS", "R": "SSH", "S": "SMTP"}.items()), "ports"
    formats = [q[1] for q in MOCK_1]
    topics = [q[0] for q in MOCK_1]
    assert len(set(formats)) == len(MOCK_1), "a question format repeats"
    assert len(set(topics)) == len(MOCK_1), "a topic repeats"
    for q in MOCK_1:
        assert 1 <= q[4] <= 4 and len(set(q[3])) == 4, q[0]


def build(template, mock_no, out):
    verify()
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    qs = MOCKS[mock_no]
    for n, (topic, fmt, text, opts, right, expl, diff) in enumerate(qs, 1):
        tags = f"accenture, technical assessment, networking security cloud, {topic.lower()}, {fmt.lower()}, mock test {mock_no}, {diff.lower()}"
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}", f"{{TOPIC}} {TOPIC}",
                     f"{{TAGS}} {tags}", "{QUESTION TYPE} SINGLECORRECT"]:
            d.add_paragraph(line)
        par = d.add_paragraph("{QUESTION TEXT} ")
        for k, part in enumerate(text.split("<br>")):
            if k:
                par.add_run().add_break()
            par.add_run(part)
        d.add_paragraph("")
        for i in range(10):
            d.add_paragraph(f"{{OPTION {i + 1}}} {opts[i] if i < len(opts) else ''}".rstrip())
        for line in [f"{{RIGHT ANSWER}} {right}", f"{{EXPLANATION}} {expl}", "{CORRECT MARKS} 1",
                     "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {diff}", "{QUESTION ENDS}", "", ""]:
            d.add_paragraph(line)
    d.save(out)
    from collections import Counter
    print("answer positions:", Counter(q[4] for q in qs))
    return len(qs)


if __name__ == "__main__":
    print("wrote", build(sys.argv[1], int(sys.argv[2]), sys.argv[3]), "questions to", sys.argv[3])
