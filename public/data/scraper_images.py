import os
import time
from pinterest_dl import PinterestDL

# This is the revised dictionary of search queries.
cached_search_queries = {
    # German
    'de_standard': '"German people"',
    'de_bavarian': '"Bavarian people"',
    'de_rhine_franconian': '"people from Hesse Germany"',
    'de_saxon': '"people from Saxony Germany"',
    # Spanish
    'es_mexican': '"Mexican people"',
    'es_peninsular': '"people from Spain"',
    'es_argentine': '"Argentine people"',
    'es_peruvian': '"Peruvian people"',
    'es_colombian': '"Colombian people"',
    'es_dominican': '"Dominican people"',
    'es_chilean': '"Chilean people"',
    'es_andalusian': '"Andalusian people"',
    'es_cuban': '"Cuban people"',
    'es_puerto_rican': '"Puerto Rican people"',
    'es_ecuadorian': '"Ecuadorian people"',
    'es_venezuelan': '"Venezuelan people"',
    'es_canary_islands': '"Canary Islands people"',
    'es_galician': '"Galician people"',
    # English
    'en_american': '"American people"',
    'en_british': '"British people"',
    'en_indian': '"Indian people"',
    'en_australian': '"Australian people"',
    'en_south_african': '"South African people"',
    'en_new_zealand': '"New Zealand people"',
    'en_irish': '"Irish people"',
    'en_canadian': '"Canadian people"',
    'en_nigerian': '"Nigerian people"',
    'en_scottish': '"Scottish people"',
    'en_new_york': '"New York people"',
    'en_african_american': '"African American people"',
    'en_geordie': '"Geordie people"',
    'en_singaporean': '"Singaporean people"',
    'en_boston': '"Boston people"',
    'en_yorkshire': '"Yorkshire people"',
    'en_chicago': '"Chicago people"',
    'en_welsh': '"Welsh people"',
    'en_jamaican': '"Jamaican people"',
    'en_cockney': '"Cockney people"',
    # French
    'fr_parisian': '"Parisian people"',
    'fr_standard': '"French people"',
    'fr_swiss': '"Swiss people"',
    'fr_quebec': '"Quebec people"',
    'fr_african': '"West African francophone people"',
    'fr_meridional': '"Southern French people"',
    'fr_belgian': '"Belgian people"',
    # Vietnamese
    'vi_standard': '"Vietnamese people"',
    'vi_southern': '"Southern Vietnamese people"',
    'vi_central': '"Central Vietnamese people"',
    'vi_northern': '"Northern Vietnamese people"',
    # Portuguese
    'pt_rio_de_janeiro': '"Rio de Janeiro people"',
    'pt_sao_paulo': '"Sao Paulo people"',
    'pt_minas_gerais': '"Mineiro people from Minas Gerais"',
    'pt_interior_paulista': '"people from interior São Paulo"',
    'pt_nordeste': '"Northeastern Brazilian people"',
    'pt_centro-oeste': '"Central-West Brazilian people"',
    'pt_brazilian': '"Brazilian people"',
    'pt_european': '"Portuguese people"',
    'pt_african': '"Angolan people"',
    # Korean
    'ko_seoul': '"Seoul people"',
    'ko_jeolla': '"people from Jeolla province Korea"',
    'ko_standard': '"Korean people"',
    'ko_hamgyong': '"people from Hamgyong province Korea"',
    'ko_gyeongsang': '"people from Gyeongsang province Korea"',
    'ko_chungcheong': '"people from Chungcheong province Korea"',
    # Hindi
    'hi_standard': '"Indian people"',
    'hi_marathi': '"Marathi-speaking people"',
    'hi_bhojpuri': '"Bhojpuri people"',
    'hi_gujarati': '"Gujarati people"',
    'hi_bengali': '"Bengali people"',
    'hi_tamil': '"Tamil people"',
    'hi_bihari': '"Bihari people"',
    'hi_punjabi': '"Punjabi people"',
    'hi_haryanvi': '"Haryanvi people"',
    # Japanese
    'ja_kanto': '"Tokyo people"',
    'ja_kansai': '"Osaka people"',
    'ja_standard': '"Japanese people"',
    # Slovak
    'sk_central': '"Central Slovak people"',
    'sk_standard': '"Slovak people"',
    # Russian
    'ru_moscow': '"Moscow people"',
    'ru_standard': '"Russian people"',
    'ru_saint_petersburg': '"Saint Petersburg people"',
    # Filipino
    'fil_standard': '"Filipino people"',
    'fil_cebuano': '"Cebuano people"',
    'fil_ilocano': '"Ilocano people"',
    # Indonesian
    'id_standard': '"Indonesian people"',
    'id_javanese': '"Javanese people"',
    'id_sundanese': '"Sundanese people"',
    'id_balinese': '"Balinese people"',
    # Italian
    'it_standard': '"Italian people"',
    'it_romanesco': '"Roman people"',
    'it_tuscan': '"Tuscan people"',
    'it_milanese': '"Milanese people"',
    'it_venetian': '"Venetian people"',
    'it_sicilian': '"Sicilian people"',
    'it_florentine': '"Florentine people"',
    'it_neapolitan': '"Neapolitan people"',
    # Polish
    'pl_standard': '"Polish people"',
    'pl_kashubian': '"Kashubian people"',
    'pl_mazovian': '"Mazovian people"',
    # Arabic
    'ar_saudi': '"Saudi people"',
    'ar_egyptian': '"Egyptian people"',
    'ar_modern_standard': '"Arab people"',
    'ar_algerian': '"Algerian people"',
    'ar_palestinian': '"Palestinian people"',
    'ar_moroccan': '"Moroccan people"',
    'ar_jordanian': '"Jordanian people"',
    'ar_gulf': '"Khaleeji people"',
    'ar_kuwaiti': '"Kuwaiti people"',
    'ar_levantine': '"Levantine people"',
    # Dutch
    'nl_standard': '"Dutch people"',
    'nl_flemish': '"Flemish people"',
    'nl_limburgish': '"Limburgish people"',
    # Turkish
    'tr_standard': '"Turkish people"',
    'tr_istanbul': '"Istanbul people"',
    'tr_aegean': '"people from Aegean Turkey"',
    'tr_eastern': '"people from Eastern Turkey"',
    'tr_central': '"people from Central Anatolia Turkey"',
    'tr_anatolian': '"Anatolian people"',
    # Czech
    'cs_standard': '"Czech people"',
    'cs_moravian': '"Moravian people"',
    'cs_prague': '"Prague people"',
    # Chinese
    'zh_taiwan_mandarin': '"Taiwanese people"',
    'zh_beijing_mandarin': '"Beijing people"',
    'zh_hong_kong_cantonese': '"Hong Kong people"',
    'zh_standard': '"Chinese people"',
    'zh_singapore_mandarin': '"Singaporean people"',
    # Romanian
    'ro_moldovan': '"Moldovan people"',
    'ro_standard': '"Romanian people"',
    'ro_oltenia': '"people from Oltenia Romania"',
    'ro_transylvanian': '"Transylvanian people"',
    # Malay
    'ms_malaysian': '"Malaysian people"',
    # Ukrainian
    'uk_standard': '"Ukrainian people"',
    'uk_kiev': '"Kiev people"',
    # Tamil
    'ta_chennai': '"Chennai people"',
    'ta_standard': '"Tamil people"',
    'ta_coimbatore': '"Coimbatore people"',
    # Bulgarian
    'bg_sofia': '"Sofia people"',
    'bg_standard': '"Bulgarian people"',
    # Hungarian
    'hu_standard': '"Hungarian people"',
    'hu_budapest': '"Budapest people"',
    # Norwegian
    'no_oslo': '"Oslo people"',
    'no_bergen': '"Bergen people"',
    'no_standard': '"Norwegian people"',
    # Finnish
    'fi_turku': '"people from Turku Finland"',
    'fi_helsinki': '"Helsinki people"',
    'fi_standard': '"Finnish people"',
    'fi_western': '"people from Western Finland"',
    # Swedish
    'sv_scanian': '"Scanian people"',
    'sv_gothenburg': '"Gothenburg people"',
    'sv_standard': '"Swedish people"',
    'sv_stockholm': '"Stockholm people"',
    # Danish
    'da_standard': '"Danish people"',
    'da_jutlandic': '"Jutlandic people"',
    'da_zealandic': '"people from Zealand Denmark"',
    # Croatian
    'hr_standard': '"Croatian people"',
    'hr_zagreb': '"Zagreb people"',
    # Greek
    'el_standard': '"Greek people"',
    'el_macedonian': '"Greek Macedonian people"',
    'el_athenian': '"Athenian people"',
    'el_aegean': '"people from Aegean Islands Greece"',
    # Other Languages
    'af_standard': '"Afrikaner people"',
    'hy_standard': '"Armenian people"',
    'as_standard': '"Assamese people"',
    'az_standard': '"Azerbaijani people"',
    'be_standard': '"Belarusian people"',
    'bn_standard': '"Bengali people"',
    'bs_standard': '"Bosnian people"',
    'ca_standard': '"Catalan people"',
    'ceb_standard': '"Cebuano people"',
    'ny_standard': '"Chewa people Malawi"',
    'et_standard': '"Estonian people"',
    'gl_standard': '"Galician people"',
    'ka_standard': '"Georgian people"',
    'gu_standard': '"Gujarati people"',
    'ha_standard': '"Hausa people"',
    'he_standard': '"Israeli people"',
    'is_standard': '"Icelandic people"',
    'ga_standard': '"Irish people"',
    'jv_standard': '"Javanese people"',
    'kn_standard': '"Kannada people"',
    'kk_standard': '"Kazakh people"',
    'ky_standard': '"Kyrgyz people"',
    'lv_standard': '"Latvian people"',
    'ln_standard': '"Congolese people Kinshasa"',
    'lt_standard': '"Lithuanian people"',
    'lb_standard': '"Luxembourgish people"',
    'mk_standard': '"Macedonian people"',
    'ml_standard': '"Malayali people"',
    'mr_standard': '"Marathi people"',
    'ne_standard': '"Nepali people"',
    'ps_standard': '"Pashtun people"',
    'fa_standard': '"Persian people"',
    'pa_standard': '"Punjabi people"',
    'sr_standard': '"Serbian people"',
    'sd_standard': '"Sindhi people"',
    'sl_standard': '"Slovenian people"',
    'so_standard': '"Somali people"',
    'sw_standard': '"Swahili people"',
    'th_standard': '"Thai people"',
    'ur_standard': '"Pakistani people"',
    'cy_standard': '"Welsh people"',
}

problematic_queries = {'en_british': '"British people"'}

def download_with_pinterest_dl(queries_dict, main_output_folder):
    """
    Loops through a dictionary of queries and uses pinterest-dl to download
    one image for each into a unique subfolder.
    """
    print(f"--- Starting Pinterest Downloader using pinterest-dl ---")

    if not os.path.exists(main_output_folder):
        os.makedirs(main_output_folder)
        print(f"Created main directory: {main_output_folder}")
    
    # Initialize the downloader once with your preferred settings
    downloader = PinterestDL.with_api(
        timeout=10, 
        verbose=False,
        ensure_alt=False 
    )

    for key, query in queries_dict.items():
        try:
            # Define a unique output directory for each query
            # This keeps the results organized.
            specific_output_dir = os.path.join(main_output_folder, key)
            
            print(f"\nProcessing '{key}'...")
            print(f"  -> Search query: {query}")
            print(f"  -> Saving to: {specific_output_dir}")

            # Run the search and download
            images = downloader.search_and_download(
                query=query,
                output_dir=specific_output_dir,
                num=20,  # We want the first 10 results
                min_resolution=(400, 400), # Optional: ensure a minimum quality
                delay=0.5
            )

            if images and len(images) > 0:
                print(f"  -> ✅ Success! Downloaded {len(images)} image(s).")
            else:
                print(f"  -> ⚠️ No suitable images were found or downloaded for this query.")

        except Exception as e:
            print(f"  -> ❌ An error occurred for query '{query}': {e}")
        
        # Add a brief pause between different searches to be respectful
        time.sleep(1)

    print("\n--- All downloads complete ---")


if __name__ == "__main__":
    # The main folder where all the subfolders will be created
    output_directory = "images_from_pinterest_dl"
    
    # Run the main function
    download_with_pinterest_dl(problematic_queries, output_directory)