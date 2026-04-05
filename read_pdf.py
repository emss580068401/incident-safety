import sys
import subprocess
try:
    import pypdf
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    import pypdf

reader = pypdf.PdfReader('災害調查與案例事故分析-吳俊螢-2小時.pdf')
text = []
for i, page in enumerate(reader.pages):
    text.append(f"--- Page {i+1} ---")
    page_text = page.extract_text()
    text.append(page_text if page_text else "[No text on this page]")

with open("pdf_content.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(text))
print("Done extracting to pdf_content.txt")
