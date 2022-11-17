import sys
import sqlite3
from PIL import Image, ImageDraw, ImageFont

#各functionの定義

def zipCodeText(text, wide, height, indent, font, draw):
    times = 0
    if (text is not None):
        times = len(text)
        for i in range(times):
            draw.text((wide+indent*i, height), text[i], fill=(0,0,0), font=font)

def culmnText(text, wide, height, indent, font, draw):
    times = 0
    if (text is not None):
        times = len(text)
        for i in range(times):
            draw.text((wide, height+indent*i), text[i], fill=(0,0,0), font=font)

    return height+indent*times
        
def numText(text, wide, height, indent, font, fontsize, draw):
    times = 0
    if (text is not None):
        text_str = str(text)
        times = len(text_str)
        center = wide - (indent*times)/2 + fontsize/2
        for i in range(times):
            draw.text((center+indent*i, height), text_str[i], fill=(0,0,0), font=font)
    return height+80

#メインプログラムの記載

#データベースへの接続
db_name = "./database_dev.sqlite3"
table_name = sys.argv[1]
conn = sqlite3.connect(db_name)
conn.row_factory = sqlite3.Row #dict型での値の取り出しに対応
cur = conn.cursor()

cur.execute("SELECT * FROM " + table_name + " WHERE state = 1 LIMIT 1")

for row in cur:
    #fontや各変数の定義

    image = Image.open("./public/images/general/print_letters_back.png")
    draw = ImageDraw.Draw(image)
    font_file = "./resource/tategaki_font.ttf"
    font2_size = 70
    font1 = ImageFont.truetype(font_file,size=80)
    font2 = ImageFont.truetype(font_file,size=font2_size)
    font3 = ImageFont.truetype("HGRME.TTC",size=60)
    font4 = ImageFont.truetype(font_file,size=95)
    font5_size = 50
    font5 = ImageFont.truetype(font_file,size=font5_size)
    font6 = ImageFont.truetype(font_file,size=60)
    font7 = ImageFont.truetype("HGRME.TTC",size=30)
    font8 = ImageFont.truetype(font_file,size=60)
    font_ontyu= ImageFont.truetype(font_file,size=80)
    line1=1090 #相手住所１行目
    line2=970 #相手住所１行目
    line3=620 #宛名１行の時
    line3_1=670 #宛名２行の時１行目
    line3_2=570 #宛名２行の時２行目
    line4=320 #自宅住所１行目
    line5=260 #自宅住所２行目
    line6=160 #自宅住所３行目
    ajust1=8 #相手住所の数字の横ずれ修正
    ajust2=6 #相手住所の数字のつなぎ棒の横ずれ修正
    ajust3=15 #自宅住所の数字のつなぎ棒の横ずれ修正

    #画像の描画
    print(str(row["id"]) + ":" + row["omitted_name"])

    #ZIP-CODEの描画
    zipCodeText(row["zip_code_1st"],572,182,85,font1, draw)    
    zipCodeText(row["zip_code_2nd"],832,182,80,font1, draw)

    #住所１行目の描画
    next = culmnText(row["addr_name_1st"],line1,337,font2_size,font2, draw)
    next = culmnText(" ",line1,next,font2_size-50,font2, draw)
    next = numText(row["addr_num1_1st"],line1+ajust2,next,40,font2,font2_size, draw)
    if((row["addr_num2_1st"] is not None) and ("addr_num2_1st" != "")):
        next = numText("|",line1+ajust1,next,40,font3,font2_size, draw)-10
    next = numText(row["addr_num2_1st"],line1+ajust2,next,40,font2,font2_size, draw)
    if((row["addr_num3_1st"] is not None) and ("addr_num3_1st" != "")):
        next = numText("|",line1+ajust1,next,40,font3,font2_size, draw)-10
    next = numText(row["addr_num3_1st"],line1+ajust2,next,40,font2,font2_size, draw)
    if((row["addr_num4_1st"] is not None) and ("addr_num4_1st" != "")):
        next = numText("|",line1+ajust1,next,40,font3,font2_size, draw)-10
    next = numText(row["addr_num4_1st"],line1+ajust2,next,40,font2,font2_size, draw)

    next = culmnText(" ",line1,next,font2_size-50,font2, draw)
    next = culmnText(row["building_name_1st"],line1,next,font2_size,font2, draw)
    next = numText(row["building_num_1st"],line1+ajust1,next,40,font2,font2_size, draw)
    next = culmnText(row["building_unit_1st"],line1,next,font2_size,font2, draw)
    
    #住所２行目の描画
    next = culmnText(row["addr_name_2nd"],line2,487,font2_size,font2, draw)
    next = culmnText(" ",line2,next,font2_size-50,font2, draw)
    next = numText(row["addr_num1_2nd"],line2+ajust2,next,40,font2,font2_size, draw)
    if((row["addr_num2_2nd"] is not None) and ("addr_num2_2nd" != "")):
        next = numText("|",line2+ajust1,next,40,font3,font2_size, draw)-10
    next = numText(row["addr_num2_2nd"],line2+ajust2,next,40,font2,font2_size, draw)
    if((row["addr_num3_2nd"] is not None) and ("addr_num3_2nd" != "")):
        next = numText("|",line2+ajust1,next,40,font3,font2_size, draw)-10
    next = numText(row["addr_num3_2nd"],line2+ajust2,next,40,font2,font2_size, draw)
    if((row["addr_num4_2nd"] is not None) and ("addr_num4_2nd" != "")):
        next = numText("|",line2+ajust1,next,40,font3,font2_size, draw)-10
    next = numText(row["addr_num4_2nd"],line2+ajust2,next,40,font2,font2_size, draw)

    next = culmnText(" ",line2,next,font2_size-50,font2, draw)
    next = culmnText(row["building_name_2nd"],line2,next,font2_size,font2, draw)
    next = numText(row["building_num_2nd"],line2+ajust2,next,40,font2,font2_size, draw)
    next = culmnText(row["building_unit_2nd"],line2,next,font2_size,font2, draw)

    #宛名の行数によって行位置(横)の振り分け
    if((row["printed_name_2nd"] is None) or (row["printed_name_2nd"] == "")):
        line3_atena_tmp_1st = line3
        #print("if:" + row["omitted_name"])
        #print("if:" + row["printed_name_2nd"])
    else:
        line3_atena_tmp_1st = line3_1

    #宛名の文字数を確認
    amount_of_1st_name_str = 0
    amount_of_2nd_name_str = 0
    if (row["printed_name_1st"] is not None) :
        amount_of_1st_name_str = len(row["printed_name_1st"])
    if (row["printed_name_2nd"] is not None) :
        amount_of_2nd_name_str = len(row["printed_name_2nd"])

    #宛名１行目の描画
    if((amount_of_1st_name_str < 9) and (amount_of_2nd_name_str < 9)):
        next_tmp1 = culmnText(row["printed_name_1st"],line3_atena_tmp_1st,337,95,font4, draw)
        next_tmp2 = culmnText(row["printed_name_2nd"],line3_2,487,95,font4, draw)
        next = max(next_tmp1, next_tmp2)
        culmnText("御中",line3+5,next+40,75,font_ontyu, draw)

    if(((amount_of_1st_name_str >= 9) or (amount_of_2nd_name_str >= 9)) and ((amount_of_1st_name_str < 12) and (amount_of_2nd_name_str < 12))):
        font4_1 = ImageFont.truetype(font_file,size=85)
        font_ontyu_1= ImageFont.truetype(font_file,size=75)
        next_tmp1 = culmnText(row["printed_name_1st"],line3_atena_tmp_1st,337-30,82,font4_1, draw)
        next_tmp2 = culmnText(row["printed_name_2nd"],line3_2,487-30,82,font4_1, draw)
        next = max(next_tmp1, next_tmp2)
        culmnText("御中",line3+5,next+30,70,font_ontyu_1, draw)

    if((amount_of_1st_name_str >= 12) or (amount_of_2nd_name_str >= 12)):
        font4_2 = ImageFont.truetype(font_file,size=80)
        font_ontyu_2= ImageFont.truetype(font_file,size=70)
        next_tmp1 = culmnText(row["printed_name_1st"],line3_atena_tmp_1st,337-50,75,font4_2, draw)
        next_tmp2 = culmnText(row["printed_name_2nd"],line3_2,487-50,75,font4_2, draw)
        next = max(next_tmp1, next_tmp2)
        culmnText("御中",line3+5,next+20,65,font_ontyu_2, draw)


    height2=787
    culmnText("自宅県自宅市自宅区",line4,height2,font5_size,font5, draw)
    next=culmnText("じたく",line5,height2+200,font5_size,font5, draw)
    next=culmnText(" ",line5,next,font5_size-20,font5, draw)
    next=numText("３",line5,next,40,font5,font5_size-10, draw)-25
    next=numText("|",line5+ajust3,next,40,font7,font5_size-10, draw)-40
    next=numText("６",line5,next,40,font5,font5_size-10, draw)-25
    next=numText("|",line5+ajust3,next,40,font7,font5_size-10, draw)-40
    numText("５",line5,next,40,font5,font5_size-10, draw)
    culmnText("自宅自宅有限会社",line6,height2+80,font5_size+10,font6, draw)

    zipCodeText("XXX",108,1497,49,font8, draw)    
    zipCodeText("XXXX",262,1497,49,font8, draw)

    image.save("./public/images/tables/{}/print_letters_icon.png".format(table_name))

#データベースへの接続の切断
cur.close()
conn.close()