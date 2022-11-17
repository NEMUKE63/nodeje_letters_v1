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
table_name_origin = sys.argv[1]
table_name = table_name_origin #なぜかJavascriptはsなしDBはありなのでそれの対応
type_of_hagaki = sys.argv[2]
sql_where = sys.argv[3]
conn = sqlite3.connect(db_name)
conn.row_factory = sqlite3.Row #dict型での値の取り出しに対応
cur = conn.cursor()

#データベースから値の取得
if ((sql_where is None ) or (sql_where == "")):
    cur.execute("SELECT * FROM " + table_name)
else :
    cur.execute("SELECT * FROM " + table_name + " " + sql_where)

for row in cur:
    #fontや各変数の定義
    if (type_of_hagaki == "red"):
        image = Image.open("./public/images/general/hagaki.png")
    elif (type_of_hagaki == "white"):
        image = Image.open("./public/images/general/white.png")
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
    line1=1050 #相手住所１行目
    line2=930 #相手住所１行目
    line3=580 #宛名１行の時
    line3_1=630 #宛名２行の時１行目
    line3_2=530 #宛名２行の時２行目
    line4=280 #自宅住所１行目
    line5=220 #自宅住所２行目
    line6=120 #自宅住所３行目
    ajust1=8 #相手住所の数字の横ずれ修正
    ajust2=6 #相手住所の数字のつなぎ棒の横ずれ修正
    ajust3=15 #自宅住所の数字のつなぎ棒の横ずれ修正

    #画像の描画
    print(str(row["id"]) + ":" + row["omitted_name"])

    #ZIP-CODEの描画
    zipCodeText(row["zip_code_1st"],532,145,85,font1, draw)    
    zipCodeText(row["zip_code_2nd"],792,145,80,font1, draw)

    #住所１行目の描画
    next = culmnText(row["addr_name_1st"],line1,300,font2_size,font2, draw)
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
    next = culmnText(row["addr_name_2nd"],line2,450,font2_size,font2, draw)
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
        next_tmp1 = culmnText(row["printed_name_1st"],line3_atena_tmp_1st,300,95,font4, draw)
        next_tmp2 = culmnText(row["printed_name_2nd"],line3_2,450,95,font4, draw)
        next = max(next_tmp1, next_tmp2)
        culmnText("御中",line3+5,next+40,75,font_ontyu, draw)

    if(((amount_of_1st_name_str >= 9) or (amount_of_2nd_name_str >= 9)) and ((amount_of_1st_name_str < 12) and (amount_of_2nd_name_str < 12))):
        font4_1 = ImageFont.truetype(font_file,size=85)
        font_ontyu_1= ImageFont.truetype(font_file,size=75)
        next_tmp1 = culmnText(row["printed_name_1st"],line3_atena_tmp_1st,300-30,82,font4_1, draw)
        next_tmp2 = culmnText(row["printed_name_2nd"],line3_2,450-30,82,font4_1, draw)
        next = max(next_tmp1, next_tmp2)
        culmnText("御中",line3+5,next+30,70,font_ontyu_1, draw)

    if((amount_of_1st_name_str >= 12) or (amount_of_2nd_name_str >= 12)):
        font4_2 = ImageFont.truetype(font_file,size=80)
        font_ontyu_2= ImageFont.truetype(font_file,size=70)
        next_tmp1 = culmnText(row["printed_name_1st"],line3_atena_tmp_1st,300-50,75,font4_2, draw)
        next_tmp2 = culmnText(row["printed_name_2nd"],line3_2,450-50,75,font4_2, draw)
        next = max(next_tmp1, next_tmp2)
        culmnText("御中",line3+5,next+20,65,font_ontyu_2, draw)


    height2=750
    culmnText("自宅県自宅市自宅区",line4,height2,font5_size,font5, draw)
    next=culmnText("じたく",line5,height2+200,font5_size,font5, draw)
    next=culmnText(" ",line5,next,font5_size-20,font5, draw)
    next=numText("３",line5,next,40,font5,font5_size-10, draw)-25
    next=numText("|",line5+ajust3,next,40,font7,font5_size-10, draw)-40
    next=numText("６",line5,next,40,font5,font5_size-10, draw)-25
    next=numText("|",line5+ajust3,next,40,font7,font5_size-10, draw)-40
    numText("５",line5,next,40,font5,font5_size-10, draw)
    culmnText("自宅自宅有限会社",line6,height2+80,font5_size+10,font6, draw)

    zipCodeText("XXX",68,1460,49,font8, draw)    
    zipCodeText("XXXX",222,1460,49,font8, draw)

    if (type_of_hagaki == "red"):
        image.save("./public/images/tables/{}/hagaki_red_back/hagaki{}.png".format(table_name_origin, row["id"]))
    elif (type_of_hagaki == "white"):
        image.save("./public/images/tables/{}/hagaki_white_back/hagaki{}.png".format(table_name_origin, row["id"]))

#データベースへの接続の切断
cur.close()
conn.close()