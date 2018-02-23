export const gapminder = `
country	year	gdpPercap	lifeExp	pop	continent
Australia	1952	10039.59564	69.12	8691212	Oceania
Australia	1957	10949.64959	70.33	9712569	Oceania
Australia	1962	12217.22686	70.93	10794968	Oceania
Australia	1967	14526.12465	71.1	11872264	Oceania
Australia	1972	16788.62948	71.93	13177000	Oceania
Australia	1977	18334.19751	73.49	14074100	Oceania
Australia	1982	19477.00928	74.74	15184200	Oceania
Australia	1987	21888.88903	76.32	16257249	Oceania
Australia	1992	23424.76683	77.56	17481977	Oceania
Australia	1997	26997.93657	78.83	18565243	Oceania
Australia	2002	30687.75473	80.37	19546792	Oceania
Australia	2007	34435.36744	81.235	20434176	Oceania
Canada	1952	11367.16112	68.75	14785584	Americas
Canada	1957	12489.95006	69.96	17010154	Americas
Canada	1962	13462.48555	71.3	18985849	Americas
Canada	1967	16076.58803	72.13	20819767	Americas
Canada	1972	18970.57086	72.88	22284500	Americas
Canada	1977	22090.88306	74.21	23796400	Americas
Canada	1982	22898.79214	75.76	25201900	Americas
Canada	1987	26626.51503	76.86	26549700	Americas
Canada	1992	26342.88426	77.95	28523502	Americas
Canada	1997	28954.92589	78.61	30305843	Americas
Canada	2002	33328.96507	79.77	31902268	Americas
Canada	2007	36319.23501	80.653	33390141	Americas
China	1952	400.4486107	44	556263528	Asia
China	1957	575.9870009	50.54896	637408000	Asia
China	1962	487.6740183	44.50136	665770000	Asia
China	1967	612.7056934	58.38112	754550000	Asia
China	1972	676.9000921	63.11888	862030000	Asia
China	1977	741.2374699	63.96736	943455000	Asia
China	1982	962.4213805	65.525	1000281000	Asia
China	1987	1378.904018	67.274	1084035000	Asia
China	1992	1655.784158	68.69	1164970000	Asia
China	1997	2289.234136	70.426	1230075000	Asia
China	2002	3119.280896	72.028	1280400000	Asia
China	2007	4959.114854	72.961	1318683096	Asia
France	1952	7029.809327	67.41	42459667	Europe
France	1957	8662.834898	68.93	44310863	Europe
France	1962	10560.48553	70.51	47124000	Europe
France	1967	12999.91766	71.55	49569000	Europe
France	1972	16107.19171	72.38	51732000	Europe
France	1977	18292.63514	73.83	53165019	Europe
France	1982	20293.89746	74.89	54433565	Europe
France	1987	22066.44214	76.34	55630100	Europe
France	1992	24703.79615	77.46	57374179	Europe
France	1997	25889.78487	78.64	58623428	Europe
France	2002	28926.03234	79.59	59925035	Europe
France	2007	30470.0167	80.657	61083916	Europe
Germany	1952	7144.114393	67.5	69145952	Europe
Germany	1957	10187.82665	69.1	71019069	Europe
Germany	1962	12902.46291	70.3	73739117	Europe
Germany	1967	14745.62561	70.8	76368453	Europe
Germany	1972	18016.18027	71	78717088	Europe
Germany	1977	20512.92123	72.5	78160773	Europe
Germany	1982	22031.53274	73.8	78335266	Europe
Germany	1987	24639.18566	74.847	77718298	Europe
Germany	1992	26505.30317	76.07	80597764	Europe
Germany	1997	27788.88416	77.34	82011073	Europe
Germany	2002	30035.80198	78.67	82350671	Europe
Germany	2007	32170.37442	79.406	82400996	Europe
Japan	1952	3216.956347	63.03	86459025	Asia
Japan	1957	4317.694365	65.5	91563009	Asia
Japan	1962	6576.649461	68.73	95831757	Asia
Japan	1967	9847.788607	71.43	100825279	Asia
Japan	1972	14778.78636	73.42	107188273	Asia
Japan	1977	16610.37701	75.38	113872473	Asia
Japan	1982	19384.10571	77.11	118454974	Asia
Japan	1987	22375.94189	78.67	122091325	Asia
Japan	1992	26824.89511	79.36	124329269	Asia
Japan	1997	28816.58499	80.69	125956499	Asia
Japan	2002	28604.5919	82	127065841	Asia
Japan	2007	31656.06806	82.603	127467972	Asia
Mexico	1952	3478.125529	50.789	30144317	Americas
Mexico	1957	4131.546641	55.19	35015548	Americas
Mexico	1962	4581.609385	58.299	41121485	Americas
Mexico	1967	5754.733883	60.11	47995559	Americas
Mexico	1972	6809.40669	62.361	55984294	Americas
Mexico	1977	7674.929108	65.032	63759976	Americas
Mexico	1982	9611.147541	67.405	71640904	Americas
Mexico	1987	8688.156003	69.498	80122492	Americas
Mexico	1992	9472.384295	71.455	88111030	Americas
Mexico	1997	9767.29753	73.67	95895146	Americas
Mexico	2002	10742.44053	74.902	102479927	Americas
Mexico	2007	11977.57496	76.195	108700891	Americas
Spain	1952	3834.034742	64.94	28549870	Europe
Spain	1957	4564.80241	66.66	29841614	Europe
Spain	1962	5693.843879	69.69	31158061	Europe
Spain	1967	7993.512294	71.44	32850275	Europe
Spain	1972	10638.75131	73.06	34513161	Europe
Spain	1977	13236.92117	74.39	36439000	Europe
Spain	1982	13926.16997	76.3	37983310	Europe
Spain	1987	15764.98313	76.9	38880702	Europe
Spain	1992	18603.06452	77.57	39549438	Europe
Spain	1997	20445.29896	78.77	39855442	Europe
Spain	2002	24835.47166	79.78	40152517	Europe
Spain	2007	28821.0637	80.941	40448191	Europe
United Kingdom	1952	9979.508487	69.18	50430000	Europe
United Kingdom	1957	11283.17795	70.42	51430000	Europe
United Kingdom	1962	12477.17707	70.76	53292000	Europe
United Kingdom	1967	14142.85089	71.36	54959000	Europe
United Kingdom	1972	15895.11641	72.01	56079000	Europe
United Kingdom	1977	17428.74846	72.76	56179000	Europe
United Kingdom	1982	18232.42452	74.04	56339704	Europe
United Kingdom	1987	21664.78767	75.007	56981620	Europe
United Kingdom	1992	22705.09254	76.42	57866349	Europe
United Kingdom	1997	26074.53136	77.218	58808266	Europe
United Kingdom	2002	29478.99919	78.471	59912431	Europe
United Kingdom	2007	33203.26128	79.425	60776238	Europe
United States	1952	13990.48208	68.44	157553000	Americas
United States	1957	14847.12712	69.49	171984000	Americas
United States	1962	16173.14586	70.21	186538000	Americas
United States	1967	19530.36557	70.76	198712000	Americas
United States	1972	21806.03594	71.34	209896000	Americas
United States	1977	24072.63213	73.38	220239000	Americas
United States	1982	25009.55914	74.65	232187835	Americas
United States	1987	29884.35041	75.02	242803533	Americas
United States	1992	32003.93224	76.09	256894189	Americas
United States	1997	35767.43303	76.81	272911760	Americas
United States	2002	39097.09955	77.31	287675526	Americas
United States	2007	42951.65309	78.242	301139947	Americas`.trim();
export const movies = `
Movie,Genre,Production Budget (millions),Box Office (millions),ROI,Rating IMDB
Avatar,Action,237,2784,11.7,8.0
The Blind Side,Drama,29,309,10.7,7.6
"The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",Adventure,180,745,4.1,6.9
The Dark Knight,Action,185,1005,5.4,9.0
ET: The Extra-Terrestrial,Drama,11,793,75.5,7.9
Finding Nemo,Adventure,94,940,10.0,8.1
Ghostbusters,Comedy,144,229,1.6,7.8
The Hunger Games,Thriller/Suspense,78,649,8.3,7.2
Iron Man 3,Action,178,1215,6.8,7.6
Jurassic Park,Action,53,1030,19.4,8.0
King Kong,Adventure,207,551,2.7,7.3
The Lion King,Adventure,45,968,21.5,8.4
"Monsters, Inc.",Adventure,115,577,5.0,8.0
The Twilight Saga: New Moon,Drama,50,710,14.2,4.5
Oz the Great and Powerful,Adventure,160,493,3.1,6.6
Pirates of the Caribbean: Dead Man's Chest,Adventure,225,1066,4.7,7.3
Quantum of Solace,Action,200,586,2.9,6.7
Raiders of the Lost Ark,Adventure,18,390,21.7,8.7
Star Wars Ep. I: The Phantom Menace,Adventure,115,1027,8.9,6.5
Titanic,Thriller/Suspense,200,2187,10.9,7.6
Up,Adventure,175,735,4.2,8.3
The Vow,Drama,30,196,6.5,6.7
The War of the Worlds,Action,132,704,5.3,6.5
X-Men: The Last Stand,Action,210,459,2.2,6.8
You've Got Mail,Drama,65,251,3.9,6.3
Zookeeper,Romantic Comedy,80,170,2.1,5.0`.trim();

export const Orchestra = `
Orchestra type,Group,Instrument,Number
Modern orchestra,Brass,Baritone horn,1
Early Romantic orchestra,Woodwinds,Bass Clarinet,1
Late Romantic orchestra,Woodwinds,Bass Clarinet,1
Early Romantic orchestra,Percussion,Bass Drum,1
Late Romantic orchestra,Percussion,Bass Drum,1
Modern orchestra,Percussion,Bass Drum,1
Classical orchestra,Woodwinds,Bassoons,2
Early Romantic orchestra,Woodwinds,Bassoons,2
Late Romantic orchestra,Woodwinds,Bassoons,3
Modern orchestra,Woodwinds,Bassoons,4
Late Romantic orchestra,Keyboards,Celesta,1
Modern orchestra,Keyboards,Celesta,1
Classical orchestra,Strings,Cellos,2
Early Romantic orchestra,Strings,Cellos,8
Late Romantic orchestra,Strings,Cellos,10
Modern orchestra,Strings,Cellos,12
Late Romantic orchestra,Percussion,Chimes,1
Classical orchestra,Woodwinds,Clarinets,2
Modern orchestra,Woodwinds,Clarinets,4
Early Romantic orchestra,Woodwinds,Clarinets,2
Late Romantic orchestra,Woodwinds,Clarinets,3
Early Romantic orchestra,Woodwinds,Contrabassoon,1
Late Romantic orchestra,Woodwinds,Contrabassoon,1
Early Romantic orchestra,Brass,Cornet,2
Early Romantic orchestra,Percussion,Cymbals,1
Late Romantic orchestra,Percussion,Cymbals,1
Modern orchestra,Percussion,Cymbals,1
Classical orchestra,Strings,Double basses,1
Early Romantic orchestra,Strings,Double basses,6
Late Romantic orchestra,Strings,Double basses,8
Modern orchestra,Strings,Double basses,10
Early Romantic orchestra,Woodwinds,English Horn,1
Late Romantic orchestra,Woodwinds,English Horn,1
Classical orchestra,Woodwinds,Flutes,2
Early Romantic orchestra,Woodwinds,Flutes,2
Late Romantic orchestra,Woodwinds,Flutes,3
Modern orchestra,Woodwinds,Flutes,4
Classical orchestra,Brass,French Horns,4
Early Romantic orchestra,Brass,French Horns,4
Late Romantic orchestra,Brass,French Horns,8
Modern orchestra,Brass,French Horns,8
Early Romantic orchestra,Percussion,Glockenspiel,1
Late Romantic orchestra,Percussion,Glockenspiel,1
Modern orchestra,Percussion,Glockenspiel,1
Early Romantic orchestra,Strings,Harps,1
Late Romantic orchestra,Strings,Harps,2
Modern orchestra,Strings,Harps,2
Modern orchestra,Percussion,Marimba,1
Classical orchestra,Woodwinds,Oboes,2
Early Romantic orchestra,Woodwinds,Oboes,2
Late Romantic orchestra,Woodwinds,Oboes,3
Modern orchestra,Woodwinds,Oboes,4
Late Romantic orchestra,Keyboards,Piano,1
Modern orchestra,Keyboards,Piano,1
Early Romantic orchestra,Woodwinds,Piccolo,1
Late Romantic orchestra,Woodwinds,Piccolo,1
Modern orchestra,Keyboards,Pipe organ,1
Early Romantic orchestra,Percussion,Snare Drum,1
Late Romantic orchestra,Percussion,Snare Drum,1
Modern orchestra,Percussion,Snare Drum,1
Late Romantic orchestra,Percussion,Tam-tam,1
Modern orchestra,Percussion,Tam-tam,1
Early Romantic orchestra,Percussion,Tambourine,1
Late Romantic orchestra,Percussion,Tambourine,1
Modern orchestra,Percussion,Tambourine,1
Modern orchestra,Percussion,Tenor drum,1
Classical orchestra,Percussion,Timpani,2
Early Romantic orchestra,Percussion,Timpani,3
Late Romantic orchestra,Percussion,Timpani,4
Modern orchestra,Percussion,Timpani,1
Early Romantic orchestra,Percussion,Triangle,1
Late Romantic orchestra,Percussion,Triangle,1
Modern orchestra,Percussion,Triangle,1
Early Romantic orchestra,Brass,Trombones,3
Late Romantic orchestra,Brass,Trombones,4
Modern orchestra,Brass,Trombones,6
Classical orchestra,Brass,Trumpets,2
Early Romantic orchestra,Brass,Trumpets,2
Late Romantic orchestra,Brass,Trumpets,4
Modern orchestra,Brass,Trumpets,6
Early Romantic orchestra,Brass,Tubas,1
Late Romantic orchestra,Brass,Tubas,2
Modern orchestra,Brass,Tubas,2
Modern orchestra,Percussion,Tubular bells,1
Modern orchestra,Percussion,Vibraphone,1
Classical orchestra,Strings,Violas,4
Early Romantic orchestra,Strings,Violas,10
Late Romantic orchestra,Strings,Violas,12
Modern orchestra,Strings,Violas,14
Classical orchestra,Strings,Violins 1,6
Early Romantic orchestra,Strings,Violins 1,14
Late Romantic orchestra,Strings,Violins 1,16
Modern orchestra,Strings,Violins 1,18
Classical orchestra,Strings,Violins 2,6
Early Romantic orchestra,Strings,Violins 2,12
Late Romantic orchestra,Strings,Violins 2,14
Modern orchestra,Strings,Violins 2,16
Late Romantic orchestra,Brass,Wagner Tuba,1
Modern orchestra,Percussion,Wood block,1
Late Romantic orchestra,Percussion,Xylophone,1
Modern orchestra,Percussion,Xylophone,1
`.trim();
