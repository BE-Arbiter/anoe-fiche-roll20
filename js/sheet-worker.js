console.log("comp_attr initializing");
let comp_attr = {};
comp_attr["cmb_jet"]="p";
comp_attr["cmb_trait"]="p";
comp_attr["cmb_boucliers"]="f";
comp_attr["cmb_epees"]="a";
comp_attr["cmb_esquive"]="p";
comp_attr["cmb_haches"]="f";
comp_attr["cmb_poignards"]="a";
comp_attr["cmb_pugilat"]="a";
comp_attr["cmb_strategie"]="i";
comp_attr["soc_baratin"]="ch";
comp_attr["soc_diplomatie"]="ch";
comp_attr["soc_empathie"]="i";
comp_attr["soc_etiquette"]="ch";
comp_attr["soc_interrogatoire"]="i";
comp_attr["soc_intimidation"]="c";
comp_attr["soc_marchandage"]="ch";
comp_attr["soc_seduction"]="ch";
comp_attr["soc_reseau"]="ch";
comp_attr["phy_acrobatie"]="a";
comp_attr["phy_course"]="r";
comp_attr["phy_discretion"]="a";
comp_attr["phy_escalade"]="a";
comp_attr["phy_equitation"]="a";
comp_attr["phy_filature"]="p";
comp_attr["phy_forge"]="a";
comp_attr["phy_natation"]="r";
comp_attr["phy_pickpocket"]="a";
comp_attr["phy_survie"]="c";
comp_attr["phy_recherche"]="p";
comp_attr["phy_vigilance"]="p";
comp_attr["con_artisanat"]="a";
comp_attr["con_cartographie"]="i";
comp_attr["con_conduite"]="p";
comp_attr["con_crochetage"]="a";
comp_attr["con_dissimulation"]="a";
comp_attr["con_evaluation"]="p";
comp_attr["con_faune"]="i";
comp_attr["con_heraldique"]="p";
comp_attr["con_jeu"]="r";
comp_attr["con_musique"]="p";
comp_attr["con_politique"]="i";
comp_attr["con_theologie"]="i";
comp_attr["lang_1"]="i";
comp_attr["lang_2"]="i";
comp_attr["lang_3"]="i";
comp_attr["lang_4"]="i";
comp_attr["lang_5"]="i";
comp_attr["lang_6"]="i";
comp_attr["spe_alchimie"]="i";
comp_attr["spe_medicine"]="i";
comp_attr["spe_vision_faon"]="fm";

console.log("comp_attr initialized");

function updateVitalite(){
    getAttrs([`carac_c_tot`,`carac_f_tot`],function (values){
        let force = Number(values[`carac_f_tot`]||0);
        let constitution = Number(values[`carac_c_tot`]||0);
        let vie = ((force+constitution)*2)+10;
        let vieHalf = Math.ceil(max / 2);
        let vieQuart = Math.ceil(max / 4);
        let saveobj = {};
        saveobj[`vie_max`] = vie;
        saveobj[`vie_moitie`] = vieHalf;
        saveobj[`vie_quart`] = vieQuart;
        setAttrs(saveobj);
    });
}

function updateStress(){
    getAttrs([`carac_fm_tot`,`priest_is_priest`],function (values) {
        let forceMentale = Number(values[`carac_f_tot`]||0);
        let isPriest = Number(values[`priest_is_priest`]||0);
        let asocial = (fm*2)+10;
        let saturation = (fm*3)+20;
        if(isPriest !== 0){
            asocial = (fm*3)+10;
            saturation = (fm*4)+20;
        }
        let saveobj = {};
        saveobj[`stress_asoc`] = vie;
        saveobj[`stress_sat`] = vieHalf;
        setAttrs(saveobj);
    });
}
function updateInit(){
}

function updateCompetence(competence,attribut){
    console.log("updating "+competence+" on "+attribut);
    getAttrs([`carac_${attribut}_tot`],function (values){
        let max = Number(values[`carac_${attribut}_tot`]||0);
        getAttrs([`competence_${competence}_niveau`,`competence_${competence}_maitrise`,`competence_${competence}_modif`,`competence_${competence}_armure`],function(values){
            let niveau =  Number(values[`competence_${competence}_niveau`]||0);
            let maitrise =  Number(values[`competence_${competence}_maitrise`]||0);
            let modif =  Number(values[`competence_${competence}_modif`]||0);
            let armure =  Number(values[`competence_${competence}_armure`]||0);
            if(niveau === 0){
                niveau = Math.floor(max / 3)
            }else{
                niveau = (niveau < max || max <= 0) ? niveau : max;
            }
            let total = niveau+maitrise+modif-armure;
            let saveobj = {};
            saveobj[`competence_${competence}_total`] = total;
            setAttrs(saveobj);
        });
    });
}
console.log("update_competence initialized");
function updateAttribut(attribut) {
    getAttrs([`carac_${attribut}_niv`, `carac_${attribut}_mod`], function (values) {
        let niveau = Number(values[`carac_${attribut}_niv`] || 0);
        let mod = Number(values[`carac_${attribut}_mod`] || 0);
        let tot = niveau + mod;
        let saveobj = {};
        saveobj[`carac_${attribut}_tot`] = tot;
        setAttrs(saveobj);

        for(const property in comp_attr){
            if(comp_attr[property] === attribut){
                updateCompetence(property,attribut);
            }
        }
        if(attribut === "c"){
            updateVitalite();
        }
        else if(attribut === "f"){
            updateVitalite();
        }
        else if(attribut === "fm"){
            updateVitalite();
        }
        else if(attribut === "r"){
            updateInit();
            updateActions();
        }
        else if( attribut === "i"){
            updateInit();
        }
    });
}
console.log("update_attribut initialized");

on("change:carac_a_niv change:carac_a_mod",function(){updateAttribut("a");});
on("change:carac_ch_niv change:carac_ch_mod",function(){updateAttribut("ch");});
on("change:carac_c_niv change:carac_c_mod",function(){updateAttribut("c");});
on("change:carac_f_niv change:carac_f_mod",function(){updateAttribut("f");});
on("change:carac_fm_niv change:carac_fm_mod",function(){updateAttribut("fm");});
on("change:carac_i_niv change:carac_i_mod",function(){updateAttribut("i");});
on("change:carac_p_niv change:carac_p_mod",function(){updateAttribut("p");});
on("change:carac_r_niv change:carac_r_mod",function(){updateAttribut("r");});

on("change:competence_cmb_jet_niveau change:competence_cmb_jet_maitrise change:competence_cmb_jet_mod change:competence_cmb_jet_armure",function(){updateCompetence("cmb_jet",comp_attr["cmb_jet"]);});
on("change:competence_cmb_trait_niveau change:competence_cmb_trait_maitrise change:competence_cmb_trait_mod change:competence_cmb_trait_armure",function(){updateCompetence("cmb_trait",comp_attr["cmb_trait"]);});
on("change:competence_cmb_boucliers_niveau change:competence_cmb_boucliers_maitrise change:competence_cmb_boucliers_mod change:competence_cmb_boucliers_armure",function(){updateCompetence("cmb_boucliers",comp_attr["cmb_boucliers"]);});
on("change:competence_cmb_epees_niveau change:competence_cmb_epees_maitrise change:competence_cmb_epees_mod change:competence_cmb_epees_armure",function(){updateCompetence("cmb_epees",comp_attr["cmb_epees"]);});
on("change:competence_cmb_esquive_niveau change:competence_cmb_esquive_maitrise change:competence_cmb_esquive_mod change:competence_cmb_esquive_armure",function(){updateCompetence("cmb_esquive",comp_attr["cmb_esquive"]);});
on("change:competence_cmb_haches_niveau change:competence_cmb_haches_maitrise change:competence_cmb_haches_mod change:competence_cmb_haches_armure",function(){updateCompetence("cmb_haches",comp_attr["cmb_haches"]);});
on("change:competence_cmb_poignards_niveau change:competence_cmb_poignards_maitrise change:competence_cmb_poignards_mod change:competence_cmb_poignards_armure",function(){updateCompetence("cmb_poignards",comp_attr["cmb_poignards"]);});
on("change:competence_cmb_pugilat_niveau change:competence_cmb_pugilat_maitrise change:competence_cmb_pugilat_mod change:competence_cmb_pugilat_armure",function(){updateCompetence("cmb_pugilat",comp_attr["cmb_pugilat"]);});
on("change:competence_cmb_strategie_niveau change:competence_cmb_strategie_maitrise change:competence_cmb_strategie_mod change:competence_cmb_strategie_armure",function(){updateCompetence("cmb_strategie",comp_attr["cmb_strategie"]);});
on("change:competence_cmb_custom_1_niveau change:competence_cmb_custom_1_maitrise change:competence_cmb_custom_1_mod change:competence_cmb_custom_1_armure",function(){updateCompetence("cmb_custom_1",comp_attr["cmb_custom_1"]);});
on("change:competence_cmb_custom_2_niveau change:competence_cmb_custom_2_maitrise change:competence_cmb_custom_2_mod change:competence_cmb_custom_2_armure",function(){updateCompetence("cmb_custom_2",comp_attr["cmb_custom_2"]);});
on("change:competence_soc_baratin_niveau change:competence_soc_baratin_maitrise change:competence_soc_baratin_mod change:competence_soc_baratin_armure",function(){updateCompetence("soc_baratin",comp_attr["soc_baratin"]);});
on("change:competence_soc_diplomatie_niveau change:competence_soc_diplomatie_maitrise change:competence_soc_diplomatie_mod change:competence_soc_diplomatie_armure",function(){updateCompetence("soc_diplomatie",comp_attr["soc_diplomatie"]);});
on("change:competence_soc_empathie_niveau change:competence_soc_empathie_maitrise change:competence_soc_empathie_mod change:competence_soc_empathie_armure",function(){updateCompetence("soc_empathie",comp_attr["soc_empathie"]);});
on("change:competence_soc_etiquette_niveau change:competence_soc_etiquette_maitrise change:competence_soc_etiquette_mod change:competence_soc_etiquette_armure",function(){updateCompetence("soc_etiquette",comp_attr["soc_etiquette"]);});
on("change:competence_soc_interrogatoire_niveau change:competence_soc_interrogatoire_maitrise change:competence_soc_interrogatoire_mod change:competence_soc_interrogatoire_armure",function(){updateCompetence("soc_interrogatoire",comp_attr["soc_interrogatoire"]);});
on("change:competence_soc_intimidation_niveau change:competence_soc_intimidation_maitrise change:competence_soc_intimidation_mod change:competence_soc_intimidation_armure",function(){updateCompetence("soc_intimidation",comp_attr["soc_intimidation"]);});
on("change:competence_soc_marchandage_niveau change:competence_soc_marchandage_maitrise change:competence_soc_marchandage_mod change:competence_soc_marchandage_armure",function(){updateCompetence("soc_marchandage",comp_attr["soc_marchandage"]);});
on("change:competence_soc_seduction_niveau change:competence_soc_seduction_maitrise change:competence_soc_seduction_mod change:competence_soc_seduction_armure",function(){updateCompetence("soc_seduction",comp_attr["soc_seduction"]);});
on("change:competence_soc_reseau_niveau change:competence_soc_reseau_maitrise change:competence_soc_reseau_mod change:competence_soc_reseau_armure",function(){updateCompetence("soc_reseau",comp_attr["soc_reseau"]);});
on("change:competence_soc_custom_1_niveau change:competence_soc_custom_1_maitrise change:competence_soc_custom_1_mod change:competence_soc_custom_1_armure",function(){updateCompetence("soc_custom_1",comp_attr["soc_custom_1"]);});
on("change:competence_soc_custom_2_niveau change:competence_soc_custom_2_maitrise change:competence_soc_custom_2_mod change:competence_soc_custom_2_armure",function(){updateCompetence("soc_custom_2",comp_attr["soc_custom_2"]);});
on("change:competence_phy_acrobatie_niveau change:competence_phy_acrobatie_maitrise change:competence_phy_acrobatie_mod change:competence_phy_acrobatie_armure",function(){updateCompetence("phy_acrobatie",comp_attr["phy_acrobatie"]);});
on("change:competence_phy_course_niveau change:competence_phy_course_maitrise change:competence_phy_course_mod change:competence_phy_course_armure",function(){updateCompetence("phy_course",comp_attr["phy_course"]);});
on("change:competence_phy_discretion_niveau change:competence_phy_discretion_maitrise change:competence_phy_discretion_mod change:competence_phy_discretion_armure",function(){updateCompetence("phy_discretion",comp_attr["phy_discretion"]);});
on("change:competence_phy_escalade_niveau change:competence_phy_escalade_maitrise change:competence_phy_escalade_mod change:competence_phy_escalade_armure",function(){updateCompetence("phy_escalade",comp_attr["phy_escalade"]);});
on("change:competence_phy_equitation_niveau change:competence_phy_equitation_maitrise change:competence_phy_equitation_mod change:competence_phy_equitation_armure",function(){updateCompetence("phy_equitation",comp_attr["phy_equitation"]);});
on("change:competence_phy_filature_niveau change:competence_phy_filature_maitrise change:competence_phy_filature_mod change:competence_phy_filature_armure",function(){updateCompetence("phy_filature",comp_attr["phy_filature"]);});
on("change:competence_phy_forge_niveau change:competence_phy_forge_maitrise change:competence_phy_forge_mod change:competence_phy_forge_armure",function(){updateCompetence("phy_forge",comp_attr["phy_forge"]);});
on("change:competence_phy_natation_niveau change:competence_phy_natation_maitrise change:competence_phy_natation_mod change:competence_phy_natation_armure",function(){updateCompetence("phy_natation",comp_attr["phy_natation"]);});
on("change:competence_phy_pickpocket_niveau change:competence_phy_pickpocket_maitrise change:competence_phy_pickpocket_mod change:competence_phy_pickpocket_armure",function(){updateCompetence("phy_pickpocket",comp_attr["phy_pickpocket"]);});
on("change:competence_phy_survie_niveau change:competence_phy_survie_maitrise change:competence_phy_survie_mod change:competence_phy_survie_armure",function(){updateCompetence("phy_survie",comp_attr["phy_survie"]);});
on("change:competence_phy_recherche_niveau change:competence_phy_recherche_maitrise change:competence_phy_recherche_mod change:competence_phy_recherche_armure",function(){updateCompetence("phy_recherche",comp_attr["phy_recherche"]);});
on("change:competence_phy_vigilance_niveau change:competence_phy_vigilance_maitrise change:competence_phy_vigilance_mod change:competence_phy_vigilance_armure",function(){updateCompetence("phy_vigilance",comp_attr["phy_vigilance"]);});
on("change:competence_phy_custom_1_niveau change:competence_phy_custom_1_maitrise change:competence_phy_custom_1_mod change:competence_phy_custom_1_armure",function(){updateCompetence("phy_custom_1",comp_attr["phy_custom_1"]);});
on("change:competence_phy_custom_2_niveau change:competence_phy_custom_2_maitrise change:competence_phy_custom_2_mod change:competence_phy_custom_2_armure",function(){updateCompetence("phy_custom_2",comp_attr["phy_custom_2"]);});
on("change:competence_con_artisanat_niveau change:competence_con_artisanat_maitrise change:competence_con_artisanat_mod change:competence_con_artisanat_armure",function(){updateCompetence("con_artisanat",comp_attr["con_artisanat"]);});
on("change:competence_con_cartographie_niveau change:competence_con_cartographie_maitrise change:competence_con_cartographie_mod change:competence_con_cartographie_armure",function(){updateCompetence("con_cartographie",comp_attr["con_cartographie"]);});
on("change:competence_con_conduite_niveau change:competence_con_conduite_maitrise change:competence_con_conduite_mod change:competence_con_conduite_armure",function(){updateCompetence("con_conduite",comp_attr["con_conduite"]);});
on("change:competence_con_crochetage_niveau change:competence_con_crochetage_maitrise change:competence_con_crochetage_mod change:competence_con_crochetage_armure",function(){updateCompetence("con_crochetage",comp_attr["con_crochetage"]);});
on("change:competence_con_dissimulation_niveau change:competence_con_dissimulation_maitrise change:competence_con_dissimulation_mod change:competence_con_dissimulation_armure",function(){updateCompetence("con_dissimulation",comp_attr["con_dissimulation"]);});
on("change:competence_con_evaluation_niveau change:competence_con_evaluation_maitrise change:competence_con_evaluation_mod change:competence_con_evaluation_armure",function(){updateCompetence("con_evaluation",comp_attr["con_evaluation"]);});
on("change:competence_con_faune_niveau change:competence_con_faune_maitrise change:competence_con_faune_mod change:competence_con_faune_armure",function(){updateCompetence("con_faune",comp_attr["con_faune"]);});
on("change:competence_con_heraldique_niveau change:competence_con_heraldique_maitrise change:competence_con_heraldique_mod change:competence_con_heraldique_armure",function(){updateCompetence("con_heraldique",comp_attr["con_heraldique"]);});
on("change:competence_con_jeu_niveau change:competence_con_jeu_maitrise change:competence_con_jeu_mod change:competence_con_jeu_armure",function(){updateCompetence("con_jeu",comp_attr["con_jeu"]);});
on("change:competence_con_musique_niveau change:competence_con_musique_maitrise change:competence_con_musique_mod change:competence_con_musique_armure",function(){updateCompetence("con_musique",comp_attr["con_musique"]);});
on("change:competence_con_politique_niveau change:competence_con_politique_maitrise change:competence_con_politique_mod change:competence_con_politique_armure",function(){updateCompetence("con_politique",comp_attr["con_politique"]);});
on("change:competence_con_theologie_niveau change:competence_con_theologie_maitrise change:competence_con_theologie_mod change:competence_con_theologie_armure",function(){updateCompetence("con_theologie",comp_attr["con_theologie"]);});
on("change:competence_con_custom_1_niveau change:competence_con_custom_1_maitrise change:competence_con_custom_1_mod change:competence_con_custom_1_armure",function(){updateCompetence("con_custom_1",comp_attr["con_custom_1"]);});
on("change:competence_con_custom_2_niveau change:competence_con_custom_2_maitrise change:competence_con_custom_2_mod change:competence_con_custom_2_armure",function(){updateCompetence("con_custom_2",comp_attr["con_custom_2"]);});
on("change:competence_lang_1_niveau change:competence_lang_1_maitrise change:competence_lang_1_mod change:competence_lang_1_armure",function(){updateCompetence("lang_1",comp_attr["lang_1"]);});
on("change:competence_lang_2_niveau change:competence_lang_2_maitrise change:competence_lang_2_mod change:competence_lang_2_armure",function(){updateCompetence("lang_2",comp_attr["lang_2"]);});
on("change:competence_lang_3_niveau change:competence_lang_3_maitrise change:competence_lang_3_mod change:competence_lang_3_armure",function(){updateCompetence("lang_3",comp_attr["lang_3"]);});
on("change:competence_lang_4_niveau change:competence_lang_4_maitrise change:competence_lang_4_mod change:competence_lang_4_armure",function(){updateCompetence("lang_4",comp_attr["lang_4"]);});
on("change:competence_lang_5_niveau change:competence_lang_5_maitrise change:competence_lang_5_mod change:competence_lang_5_armure",function(){updateCompetence("lang_5",comp_attr["lang_5"]);});
on("change:competence_lang_6_niveau change:competence_lang_6_maitrise change:competence_lang_6_mod change:competence_lang_6_armure",function(){updateCompetence("lang_6",comp_attr["lang_6"]);});
on("change:competence_spe_alchimie_niveau change:competence_spe_alchimie_maitrise change:competence_spe_alchimie_mod change:competence_spe_alchimie_armure",function(){updateCompetence("spe_alchimie",comp_attr["spe_alchimie"]);});
on("change:competence_spe_medicine_niveau change:competence_spe_medicine_maitrise change:competence_spe_medicine_mod change:competence_spe_medicine_armure",function(){updateCompetence("spe_medicine",comp_attr["spe_medicine"]);});
on("change:competence_spe_vision_faon_niveau change:competence_spe_vision_faon_maitrise change:competence_spe_vision_faon_mod change:competence_spe_vision_faon_armure",function(){updateCompetence("spe_vision_faon",comp_attr["spe_vision_faon"]);});
on("change:competence_spe_custom_1_niveau change:competence_spe_custom_1_maitrise change:competence_spe_custom_1_mod change:competence_spe_custom_1_armure",function(){updateCompetence("spe_custom_1",comp_attr["spe_custom_1"]);});
on("change:competence_spe_custom_2_niveau change:competence_spe_custom_2_maitrise change:competence_spe_custom_2_mod change:competence_spe_custom_2_armure",function(){updateCompetence("spe_custom_2",comp_attr["spe_custom_2"]);});
on("change:competence_spe_custom_3_niveau change:competence_spe_custom_3_maitrise change:competence_spe_custom_3_mod change:competence_spe_custom_3_armure",function(){updateCompetence("spe_custom_3",comp_attr["spe_custom_3"]);});

console.log("worker fully initialized");
