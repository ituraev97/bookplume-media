S=[
("Can you name all eight contents of the spermatic cord?",0.15),
("Papers Don't Contribute To A Good Specialist Level.",0.3),
("P. Pampiniform plexus. The veins.",0.12),
("D. Ductus deferens. Carries sperm.",0.12),
("C. Cremasteric artery.",0.12),
("T. Testicular artery. From the aorta.",0.12),
("A. Artery of the ductus deferens.",0.12),
("G. Genital branch of the genitofemoral nerve.",0.12),
("S. Sympathetic fibers.",0.12),
("L. Lymphatics.",0.3),
("Quick test. Which one is the venous plexus?",0.25),
("Three.",0.2),
("Two.",0.2),
("One.",0.3),
("Pampiniform plexus.",0.3),
("Save this for your next anatomy exam.",0.3),
]
import re
print(sum(len(re.findall(r"[A-Za-z']+",s)) for s,_ in S),"words")
