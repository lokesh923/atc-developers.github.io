from lib import *
import numpy as np
YEARS=[2021,2022,2023,2024];SALES={'Alpha':[120,150,180,162],'Beta':[200,180,216,270],'Gamma':[90,108,135,162],'Delta':[150,165,198,220]}
EXP={'Salary':30,'Rent':15,'Raw material':35,'Marketing':12,'Others':8};TOTAL=240000
def f_bar():
    f,ax=plt.subplots(figsize=(9.2,3.5));w=0.2;cols=['#1f4b9e','#b45309','#0f7d6b','#7c2d92']
    for i,(k,v) in enumerate(SALES.items()):
        xs=np.arange(4)+i*w;ax.bar(xs,v,w,label=k,color=cols[i])
        for x,val in zip(xs,v):ax.text(x,val+3,str(val),ha='center',fontsize=7)
    ax.set_xticks(np.arange(4)+1.5*w);ax.set_xticklabels(YEARS);ax.legend(ncol=4,fontsize=8,frameon=False,loc='upper left');ax.set_ylabel('Sales (thousand units)',fontsize=9);ax.set_ylim(0,330);ax.spines[['top','right']].set_visible(False)
    ax.set_title('Bar chart: sales of four companies',fontsize=10.5,fontweight='bold');save(f,'aq9_bar')
def f_pie():
    f,axs=plt.subplots(1,2,figsize=(9.2,3.3),gridspec_kw={'width_ratios':[1,1.15]})
    ax=axs[0];ax.pie(list(EXP.values()),labels=[f'{k}\n{v}%' for k,v in EXP.items()],colors=['#dbeafe','#fde68a','#dcfce7','#fecaca','#e9d5ff'],wedgeprops=dict(ec='#14213d'),textprops=dict(fontsize=8));ax.set_title('Pie chart: expenses of a firm (total ₹2,40,000)',fontsize=9.5,fontweight='bold')
    ax=axs[1];yrs=YEARS;prof=[12,18,15,24];ax.plot(yrs,prof,'-o',color='#be123c',lw=2.2)
    for x,y in zip(yrs,prof):ax.text(x,y+1,f'{y}%',ha='center',fontsize=8.5,fontweight='bold')
    ax.set_ylim(5,30);ax.set_xticks(yrs);ax.set_ylabel('Profit %',fontsize=9);ax.set_title('Line graph: profit percentage',fontsize=9.5,fontweight='bold');ax.spines[['top','right']].set_visible(False)
    save(f,'aq9_pie')
f_bar();f_pie()
def html():
    h=top('Data Interpretation','ADVANCED QUANT · DATA · MUST-DO','#1d6fa5')
    h+=intro('A Data Interpretation (DI) set is a table or chart followed by several questions. The numbers are not hard; the <b>reading and the percentage arithmetic under time pressure</b> are. The method is: read the title and units, locate the numbers asked, and use <b>approximation</b> when the options are far apart.')
    h+=fig('aq9_bar','Bar chart. Check the unit (thousand units) before you calculate.')
    h+=form('Formulas used in DI',['<b>Percentage change = (new − old)/old × 100.</b> Always divide by the OLD value.','<b>Percentage of total = part/total × 100.</b>','<b>Ratio:</b> compare values by dividing; ratios of percentages equal ratios of values when the total is the same.','<b>Average = sum/number of items.</b> Weighted average for groups of different sizes.','<b>Percentage points</b> vs <b>percent</b>: a rise from 12% to 18% is 6 percentage points but 50% in relative terms.','<b>CAGR (growth per year)</b> for 2 years: (1 + g)² = final/initial.','Pie chart: a slice of x% has an angle of 3.6 × x degrees.','Table with missing cells: use row and column totals to find them.'])
    a=SALES['Beta'];ch=(a[3]-a[2])/a[2]*100;tot23=sum(v[2] for v in SALES.values());shr=SALES['Gamma'][2]/tot23*100
    h+=ex('From the bar chart, find the percentage increase in the sales of Beta from 2023 to 2024.',f'{ch:.2f}%'.replace('.00',''),f'({a[3]} − {a[2]})/{a[2]} × 100 = {a[3]-a[2]}/{a[2]} × 100 = {ch:.2f}%.')
    h+=ex('What percentage of the total sales of all four companies in 2023 was the sales of Gamma?',f'{shr:.2f}%',f'Total in 2023 = {" + ".join(str(v[2]) for v in SALES.values())} = {tot23}. Gamma = {SALES["Gamma"][2]}/{tot23} × 100 = {shr:.2f}%.')
    avgA=sum(SALES['Alpha'])/4;best=max(SALES,key=lambda k:SALES[k][3]-SALES[k][0])
    h+=ex('What is the average yearly sales of Alpha, and which company showed the largest absolute increase from 2021 to 2024?',f'{avgA}; {best}',f'Alpha: ({" + ".join(map(str,SALES["Alpha"]))})/4 = {avgA}. Increases 2021→2024: '+', '.join(f'{k} {v[3]-v[0]}' for k,v in SALES.items())+f'. Largest: {best}.')
    h+=fig('aq9_pie','Pie chart and line graph. Pie slices are percentages of one total; the angle of a slice is 3.6° per percent.')
    sal=TOTAL*EXP['Salary']/100;ang=3.6*EXP['Raw material']
    h+=ex('In the pie chart, what amount (in ₹) is spent on salary, and what is the central angle of the Raw material slice?',f'₹{int(sal):,}; {ang}°',f'Salary = 30% of ₹2,40,000 = ₹{int(sal):,}. Raw material = 35% × 3.6° = {ang}°.')
    prof=[12,18,15,24]
    h+=ex('From the line graph, by what percentage points did the profit rise from 2021 to 2022, and by what percent in relative terms?',f'{prof[1]-prof[0]} points; {(prof[1]-prof[0])/prof[0]*100:.0f}%','18 − 12 = 6 percentage points. Relative rise = 6/12 × 100 = 50%.')
    h+=ex('If the 2024 sales of Delta were 12% more than the 2023 sales of Delta, how much is the 2024 figure compared with the chart?',f'{198*1.12:.2f} vs {SALES["Delta"][3]}',f'198 × 1.12 = {198*1.12:.2f}, which is higher than the {SALES["Delta"][3]} shown. This shows how a “what if” question is checked against the chart.')
    h+=h3('Table DI: missing values')
    t=[[32,45,0,28],[40,0,36,30],[0,52,41,35]];rt=[150,170,160]
    t[0][2]=rt[0]-32-45-28;t[1][1]=rt[1]-40-36-30;t[2][0]=rt[2]-52-41-35
    h+=ex('A table shows the number of items sold in four months by three stores. Row totals are 150, 170, 160. Row 1: 32, 45, ?, 28. Row 2: 40, ?, 36, 30. Row 3: ?, 52, 41, 35. Find the three missing numbers.',f'{t[0][2]}, {t[1][1]}, {t[2][0]}',f'Row 1: 150 − (32 + 45 + 28) = {t[0][2]}. Row 2: 170 − (40 + 36 + 30) = {t[1][1]}. Row 3: 160 − (52 + 41 + 35) = {t[2][0]}.')
    h+=h3('Speed techniques for DI')
    h+=tb(['Situation','Trick'],[['Percentage change','Cancel common factors first (216 → 270: both divisible by 54 → 4 → 5 → 25%).'],['Compare two ratios','Cross-multiply instead of dividing.'],['Which is largest?','Estimate; do not compute exactly unless close.'],['Percent of a total','Use fractions: 12.5% = 1/8, 16.67% = 1/6, 37.5% = 3/8.'],['Pie chart with values','Convert angles: 90° = 25%, 120° = 33.33%.'],['Average of many values','Pick a base and add small differences.']],'sm')
    h+=tips(['Read the units and the legend first. A thousand-versus-lakh slip costs the whole set.','Underline “increase”, “decrease”, “compared with”, “as a percentage of”. Each fixes the base of the percentage.','If two options are within 2%, calculate exactly; otherwise estimate.','For “which year had the highest …”, compare only the likely candidates.'])
    h+=warn(['Dividing by the new value instead of the old one in a percentage change.','Confusing percentage points with percent.','Using the wrong year’s total.'])
    h+=pq('9. Data Interpretation','DI practice (use the charts in this chapter)',[('Sales of Alpha in 2022 as a percentage of its sales in 2021?',f'{150/120*100:.0f}%','B'),('Total sales of all companies in 2021?',str(sum(v[0] for v in SALES.values())),'B'),('Which company had the highest sales in 2024?','Beta','B'),('Percentage decrease in Alpha’s sales from 2023 to 2024?',f'{(180-162)/180*100:.0f}%','M'),('Ratio of Beta’s 2022 sales to Gamma’s 2022 sales?',f'{180//18}:{108//18}'.replace('10:6','5:3'),'M'),('Average sales of Gamma over the four years?',str(sum(SALES['Gamma'])/4),'M'),('Rent expense in ₹ (pie chart)?',str(int(TOTAL*EXP['Rent']/100)),'M'),('Central angle for Marketing?',f'{3.6*EXP["Marketing"]:.1f}°','M'),('In which year was the combined sales of Alpha and Delta the highest?',str(YEARS[max(range(4),key=lambda i:SALES['Alpha'][i]+SALES['Delta'][i])]),'A'),('CAGR-style: if Beta grows at the same yearly rate as 2022→2024 (two years), what is the single yearly growth factor g where 1+g squared = 270/180?',f'{(270/180)**.5:.4f}','A')])
    return h+end()
