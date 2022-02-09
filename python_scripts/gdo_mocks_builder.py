import os, random
from datetime import datetime, timedelta

min_year=2020
max_year=2022
def gen_datetime():
    start = datetime(min_year, 1, 1, 00, 00, 00)
    years = max_year - min_year + 1
    end = start + timedelta(days=365 * years)
    return (start + (end - start) * random.random()).strftime("%Y-%m-%d")

path = '/home/ysuss/Desktop/gdo/src/content/wid'
for filename in os.listdir(path):
    f = open(os.path.join(path, filename), "a")
    front_matter = "---\ntitle: '{0}'\ndate: '{1}'\ntags: ['starts_with_{2}']\n---".format(filename.split('.')[0], gen_datetime(), filename[0])
    f.write(front_matter)
    f.close()

dummy_text = ["\n\nVictae contra\n\nLorem markdownum procul [et](http://auditum-victima.net/manusguttura.aspx)\nsimul: est arbore *subvecta Saturnia* dapibusque\n[vocibus](http://semicaper-oculis.net/datsummis) conspexi dum socium qua carmen\nquod. Cava potuit o cruorem audiet? Dura gemit curvarique in trepidans Ismenides\naltera turbam; perisset furibunda; possis. **Est** cristata securi velut petit\nsi Antiphataeque cepimus exiguis nil multo, et. Succutiturque Glaucus invidiosa\nsemine, Aram extremo erat ait Pallas dederunt prior: est.\n\n- Tulit pete ramos urguet sceleris filia\n- Umbras aras est iramque voluit\n- Hortamine a extemplo\n- Equorum serum filia\n- Feroque dabitur moenibus et luctusque noctis de\n- Flamma contemptor faciente perspicuas si ille", "\n\nInscius Clymene mihi hasta\n\nModo cui illo promissi umbraque, contorta sumus Sithon figuram. Indigetem\ncorpus. Tollens nostri ad ursae declivis **linguaque annos**, morte sine,\nrepurgat incessere fervet praebuit inmensa, probant pias tegit. Perosus lora\ntori pendere ne nata axem nutrix dicit formam tua ire lacrimis quodque\npulcherrime dumque; cum. Sub [in](http://fuit-postquam.org/en-dare) habebat\nillum iunxit stringebat pascere, ut eosdem divulsaque gurgite hoc, dicta?\n\n```\nif (icioLion + -3 != ccd_gis_directx * command) {\n    platform(98, bandwidth_raw_multitasking + simplex_cd_software);\n} else {\n    crm_c = parse_workstation_wysiwyg;\n    lpi.motherboardMeme += -5;\n}\narchie += dual;\nif (5 / padRippingPpi + meme != 2) {\n    compressionCamelcase = copyright;\n    pciPacketMyspace(dataToken, 2);\n}\n```", "\n\nPuellae init Esse testatus illa\n\nTalibus auribus, gentes illa credi sevocat hippomene **Minervae** it praemia\nminor carior veluti patiar. Defessa viresque, lucoque superstes festinat\nsollicitive et premit admovet.\n\n```\nmnemonic_font(synTapeIt - rootkitFileAnimated(recursionReaderFlatbed, 4), 1\n        + asp / bluOrientation, storage_text);\nif (1 >= pad + copy_file + cycle_iphone) {\n    data_driver = firewire;\n    srgb_netbios(vci_bluetooth, logIm);\n}\nram(dual(gate_myspace_aiff - file_gui_compression, soapGifNoc(unicode_soap,\n        boot), boolean), driveCore, mountainFile(printerThickKibibyte,\n        mtuLifo + 71, midi_mashup_northbridge));\n```", "\n\nVincloque danti volucresque geminis pennis quam mille\n\nTu pro repperit herboso reduxi. Intermissa luces. Dea et mons arva actis tua tu\nsidere auctor at gravi me terras unicus quaecumque sorores scopulos Tirynthia\ngeneris. Animis erat brevis et Haliumque vultu, ignoto nunc obscurum bubo mala\nsacrisque, in tribus purpureus tibi lacrimas. Manum nec annos habebat auxilium\nhoc patentes venis lacrimasque ut **vapore** laterum et.\n\n1. Petit et sonus illa\n2. Temperat iacent iter\n3. Vel non\n4. Corpora spatioque\n\nNubigenasque mortis silvas, nostraque vivacia longa osque postquam probat salve\ndiversae coniuge digni Nonacrinas [ferro viaeque](http://www.ignota.com/)\nmomordi; vix. Habet candore, rata cum; raucis utere tum Cepheusque triplici sub,\nfluminis latentem tegit pestiferaque honorem?"]

for filename in os.listdir(path):
    f = open(os.path.join(path, filename), "a")
    f.write(dummy_text[random.randint(0,3)])
    f.close()