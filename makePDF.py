#フォルダの名前がimg2pdfと競合するためprogramフォルダに入れないこと
from PIL import Image
import os
import sys
import img2pdf

parent_folder = sys.argv[1]
#parent_folder = "Customers1"

pdf_FileName = "./public/images/tables/" + parent_folder + "/" +  parent_folder + "_white_letters.pdf" # 出力するPDFの名前
png_Folder = "./public/images/tables/" + parent_folder  + "/hagaki_white_back/" # 画像フォルダ
extension  = ".png" # 拡張子がPNGのものを対象

with open(pdf_FileName,"wb") as f:
    # 画像フォルダの中にあるPNGファイルを取得し配列に追加、バイナリ形式でファイルに書き込む
    f.write(img2pdf.convert([Image.open(png_Folder+j).filename for j in os.listdir(png_Folder)if j.endswith(extension)]))