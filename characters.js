
export const characters = [
    // 1.1 Virus
    {
        id: 1,
        name: "VIH",
        infoImage: "/images/enfermedades/VIH.png",
        categories: {
            agente: { text: ["Virus de la Inmunodeficiencia Humana (HIV)"], image: "/images/agente/virus.png", images: ["/images/agente/virus.png"] },
            transmision: { text: ["❤️ Sexual (semen, fluidos vaginales), 🩸 Sangre/Fluidos (transfusiones, agujas, heridas), madre-hijo"], image: "/images/transmision/sexual.png", images: ["/images/transmision/sexual.png"] },
            prevencion_ciudadana: { text: ["❤️ Sexo seguro (métodos barreras - preservativos)", "🧼 higiene (no compartir agujas)"], image: "/images/prevencion/preservativo.png", images: ["/images/prevencion/preservativo.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar: Si riesgo de contacto con fluidos: Guantes, bata, gafas, mascarilla"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🩸 Sistémico: fiebre, fatiga, infecciones oportunistas; característico: inmunosupresión progresiva"], image: "/images/organo/sistemico.png", images: ["/images/organo/sistemico.png"] }
        }
    },
    {
        id: 2,
        name: "Hepatitis B",
        infoImage: "/images/enfermedades/hepatitis_b.png",
        categories: {
            agente: { text: ["Virus de la Hepatitis B (HBV)"], image: "/images/agente/virus.png", images: ["/images/agente/virus.png"] },
            transmision: { text: ["❤️ Sexual (semen, fluidos vaginales), 🩸 Sangre/Fluidos (transfusiones, agujas, heridas), madre-hijo"], image: "/images/transmision/sexual.png", images: ["/images/transmision/sexual.png"] },
            prevencion_ciudadana: { text: ["💉 Vacunación", "❤️ Sexo seguro (métodos barreras - preservativos)", "🧼 higiene (no compartir agujas)"], image: "/images/prevencion/vacuna.png", images: ["/images/prevencion/vacuna.png", "/images/prevencion/preservativo.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar. Si riesgo de contacto con fluidos: Guantes, bata, gafas, mascarilla"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🤢 Digestivo: fatiga, náuseas, dolor abdominal; característico: ictericia (cutaneo y ojos amarillos)"], image: "/images/organo/digestivo.png", images: ["/images/organo/digestivo.png"] }
        }
    },
    {
        id: 3,
        name: "COVID-19",
        infoImage: "/images/enfermedades/Covid-19.png",
        categories: {
            agente: { text: ["SARS-CoV-2"], image: "/images/agente/virus.png", images: ["/images/agente/virus.png"] },
            transmision: { text: ["💧 Gotas (tos, estornudos, hablar con poca distancia)", "✋ Contacto con superficies (las manos son el medio)"], image: "/images/transmision/aire.png", images: ["/images/transmision/aire.png", "/images/transmision/fluidos.png"] },
            prevencion_ciudadana: { text: ["😷 Protección personal: Mascarilla quirúrgica", "🧼 Higiene: (Lavado de manos, ventilación, evitar aglomeraciones)"], image: "/images/prevencion/barreras.png", images: ["/images/prevencion/higiene.png", "/images/prevencion/barreras.png", "/images/prevencion/vacuna.png"] },
            prevencion_hospitalaria: { text: ["Aislamiento por gota 💧. guantes, bata, gafas y mascarilla quirúrgica. Si se usan aerosoles: mascarilla FFP2"], image: "/images/epi/gota.png", images: ["/images/epi/gota.png"] },
            sistema_afectado: { text: ["🫁 Respiratorio: fiebre, tos, disnea; característico: anosmia (pérdida de gusto/olfato)"], image: "/images/organo/respiratorio.png", images: ["/images/organo/respiratorio.png"] }
        }
    },
    {
        id: 4,
        name: "Varicela",
        infoImage: "/images/enfermedades/Varicela.png",
        categories: {
            agente: { text: ["Virus Varicela-Zoster (VZV)"], image: "/images/agente/virus.png", images: ["/images/agente/virus.png"] },
            transmision: { text: ["🌬 Aire (inhalación de gotículas de las heridas)", "✋ Contacto con lesiones"], image: "/images/transmision/contacto.png", images: ["/images/transmision/aire.png", "/images/transmision/contacto.png"] },
            prevencion_ciudadana: { text: ["💉 Vacunación", "🧼 Higiene: Lavado de manos, evitar contacto"], image: "/images/prevencion/vacuna.png", images: ["/images/prevencion/barreras.png", "/images/prevencion/vacuna.png", "/images/prevencion/contacto.png"] },
            prevencion_hospitalaria: { text: ["🌬 Aislamiento por aire: guantes, bata, FFP2 si inmunodeprimido"], image: "/images/epi/aire.png", images: ["/images/epi/aire.png"] },
            sistema_afectado: { text: ["🧴 cutaneo: fiebre; característico: lesiones vesiculares pruriginosas"], image: "/images/organo/cutaneo.png", images: ["/images/organo/cutaneo.png"] }
        }
    },
    {
        id: 5,
        name: "Mononucleosis",
        infoImage: "/images/enfermedades/mononucleosis.png",
        categories: {
            agente: { text: ["Virus Epstein-Barr (EBV)"], image: "/images/agente/virus.png", images: ["/images/agente/virus.png"] },
            transmision: { text: ["💧 Gotas (tos, estornudos, hablar con poca distancia)", "Contacto con saliva (besos)"], image: "/images/transmision/aire.png", images: ["/images/transmision/aire.png", "/images/transmision/fluidos.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene: no compartir cubiertos/vasos. No besos."], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar. Si riesgo de contacto con saliva: guantes"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🩸 Sistémico: fiebre, fatiga, faringitis; característico: linfocitos atípicos"], image: "/images/organo/sistemico.png", images: ["/images/organo/sistemico.png"] }
        }
    },

    // 1.2 Bacterias
    {
        id: 6,
        name: "Tuberculosis",
        infoImage: "/images/enfermedades/Tuberculosis.png",
        categories: {
            agente: { text: ["Mycobacterium tuberculosis"], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["🌬 Aire (inhalación de gotículas)"], image: "/images/transmision/aire.png", images: ["/images/transmision/aire.png"] },
            prevencion_ciudadana: { text: ["😷 Protección personal: Mascarilla quirúrgica", "🧼 Higiene: ventilación"], image: "/images/prevencion/barreras.png", images: ["/images/prevencion/barreras.png"] },
            prevencion_hospitalaria: { text: ["🌬 Aislamiento por aire: Mascarilla FFP2, guantes, bata. Si se usan aerosoles: mascarilla FFP3"], image: "/images/epi/aire.png", images: ["/images/epi/aire.png"] },
            sistema_afectado: { text: ["🫁 Respiratorio: tos crónica, fiebre, sudores nocturnos, pérdida de peso; característico: Sangre en esputo"], image: "/images/organo/respiratorio.png", images: ["/images/organo/respiratorio.png"] }
        }
    },
    {
        id: 7,
        name: "Neumonía bacteriana",
        infoImage: "/images/enfermedades/neumonia_bacteriana.png",
        categories: {
            agente: { text: ["Streptococcus pneumoniae (principal)"], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["💧 Gotas (tos, estornudos, hablar con poca distancia, contacto con secreciones)"], image: "/images/transmision/aire.png", images: ["/images/transmision/aire.png"] },
            prevencion_ciudadana: { text: ["😷 Protección personal: Mascarilla quirúrgica", "🧼 Higiene: Lavado de manos", "💉 Vacunación en grupos de riesgo"], image: "/images/prevencion/barreras.png", images: ["/images/prevencion/barreras.png"] },
            prevencion_hospitalaria: { text: ["💧 Aislamiento por gotas: guantes, bata, mascarilla quirúrgica"], image: "/images/epi/gota.png", images: ["/images/epi/gota.png"] },
            sistema_afectado: { text: ["🫁 Respiratorio: fiebre, tos, disnea, dolor torácico; característico: consolidación radiológica"], image: "/images/organo/respiratorio.png", images: ["/images/organo/respiratorio.png"] }
        }
    },
    {
        id: 8,
        name: "Gonorrea",
        infoImage: "/images/enfermedades/Gonorrea.png",
        categories: {
            agente: { text: ["Neisseria gonorrhoeae"], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["❤️ Sexual (semen, fluidos vaginales)"], image: "/images/transmision/sexual.png", images: ["/images/transmision/sexual.png"] },
            prevencion_ciudadana: { text: ["❤️ Sexo seguro (métodos barreras - preservativos, higiene genital)"], image: "/images/prevencion/preservativo.png", images: ["/images/prevencion/preservativo.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar. Si contacto con zona genital: guantes, mascarilla"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🚻 Genitourinario: disuria; característico: secreción purulenta"], image: "/images/organo/genitourinario.png", images: ["/images/organo/genitourinario.png"] }
        }
    },
    {
        id: 9,
        name: "Clamidia",
        infoImage: "/images/enfermedades/Clamidia.png",
        categories: {
            agente: { text: ["Chlamydia trachomatis"], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["❤️ Sexual (semen, fluidos vaginales)"], image: "/images/transmision/sexual.png", images: ["/images/transmision/sexual.png"] },
            prevencion_ciudadana: { text: ["❤️ Sexo seguro (métodos barreras - preservativos, higiene genital)"], image: "/images/prevencion/preservativo.png", images: ["/images/prevencion/preservativo.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar. Si contacto con zona genital: guantes, mascarilla"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🚻 Genitourinario: muchas veces asintomática, disuria; característico: secreción mucopurulenta"], image: "/images/organo/genitourinario.png", images: ["/images/organo/genitourinario.png"] }
        }
    },
    {
        id: 10,
        name: "Salmonelosis",
        infoImage: "/images/enfermedades/Salmonelosis.png",
        categories: {
            agente: { text: ["Salmonella spp."], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["🍗 Alimentos o agua contaminado(huevos crudo, lácteos no pasteurizados, frutas y verduras mal lavadas)", "✋ Contacto fecal-oral"], image: "/images/transmision/alimentos.png", images: ["/images/transmision/alimentos.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene: Lavado de manos, cocción adecuada, higiene alimentaria"], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png", "/images/prevencion/alimentos.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🤢 Digestivo: diarrea, fiebre, dolor abdominal; característico: inicio brusco tras ingestión de alimentos contaminados"], image: "/images/organo/digestivo.png", images: ["/images/organo/digestivo.png"] }
        }
    },
    {
        id: 11,
        name: "Tétanos",
        infoImage: "/images/enfermedades/Tetanos.png",
        categories: {
            agente: { text: ["Clostridium tetani"], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["✋ Contacto de polvo, heces o suciedad a través de heridas abiertas"], image: "/images/transmision/fluidos.png", images: ["/images/transmision/fluidos.png"] },
            prevencion_ciudadana: { text: ["💉 Vacunación", "😷 Protección personal: Cura de heridas"], image: "/images/prevencion/vacuna.png", images: ["/images/prevencion/vacuna.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🧠 Neurológico: espasmos musculares, rigidez; característico: no poder abrir la boca"], image: "/images/organo/neurologico.png", images: ["/images/organo/neurologico.png"] }
        }
    },
    {
        id: 12,
        name: "Botulismo",
        infoImage: "/images/enfermedades/Botulismo.png",
        categories: {
            agente: { text: ["Clostridium botulinum"], image: "/images/agente/bacteria.png", images: ["/images/agente/bacteria.png"] },
            transmision: { text: ["🍗 Alimentos contaminados (mal conservados, caseros, fermentados incorrectamente)"], image: "/images/transmision/alimentos.png", images: ["/images/transmision/fluidos.png", "/images/transmision/alimentos.png"] },
            prevencion_ciudadana: { text: ["🍳 Evitar alimentos mal conservados"], image: "/images/prevencion/alimentos.png", images: ["/images/prevencion/alimentos.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🧠 Neurológico: visión doble, dificultad respiratoria; característico: parálisis flácida"], image: "/images/organo/digestivo.png", images: ["/images/organo/digestivo.png", "/images/organo/neurologico.png"] }
        }
    },

    // 1.3 Parásitos
    {
        id: 13,
        name: "Malaria",
        infoImage: "/images/enfermedades/Malaria.png",
        categories: {
            agente: { text: ["Plasmodium spp."], image: "/images/agente/parasito.png", images: ["/images/agente/parasito.png"] },
            transmision: { text: ["🦟 Vector (picadura de mosquito Anopheles)"], image: "/images/transmision/vector.png", images: ["/images/transmision/vector.png"] },
            prevencion_ciudadana: { text: ["🚫 Evitar picaduras (mosquiteros, repelentes, ropa apropiada)"], image: "/images/prevencion/contacto.png", images: ["/images/prevencion/contacto.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🩸 Sistémico: fiebre periódica, escalofríos; característico: anemia"], image: "/images/organo/sistemico.png", images: ["/images/organo/sistemico.png"] }
        }
    },
    {
        id: 14,
        name: "Toxoplasmosis",
        infoImage: "/images/enfermedades/toxoplasmosis.png",
        categories: {
            agente: { text: ["Toxoplasma gondii"], image: "/images/agente/parasito.png", images: ["/images/agente/parasito.png"] },
            transmision: { text: ["🍗 Alimentos/ agua crudos (cerdo, cordero o venado) contaminada por con heces de gato"], image: "/images/transmision/alimentos.png", images: ["/images/transmision/alimentos.png"] },
            prevencion_ciudadana: { text: ["🍳 Cocinar carne, higiene al manipular tierra/gatos"], image: "/images/prevencion/alimentos.png", images: ["/images/prevencion/alimentos.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🤢 Digestivo: fiebre; característico: afectación ocular/neurológica"], image: "/images/organo/digestivo.png", images: ["/images/organo/digestivo.png"] }
        }
    },
    {
        id: 15,
        name: "Leishmaniosis",
        infoImage: "/images/enfermedades/leishmaniosis.png",
        categories: {
            agente: { text: ["Leishmania spp."], image: "/images/agente/parasito.png", images: ["/images/agente/parasito.png"] },
            transmision: { text: ["🦟 Vector (picadura de insecto flebótomo, vive en perros, roedores o liebres)"], image: "/images/transmision/vector.png", images: ["/images/transmision/vector.png"] },
            prevencion_ciudadana: { text: ["🚫 Evitar picaduras, repelentes"], image: "/images/prevencion/contacto.png", images: ["/images/prevencion/contacto.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🩸 Sistémico: fiebre, úlceras cutáneas; característico: hepatoesplenomegalia"], image: "/images/organo/sistemico.png", images: ["/images/organo/sistemico.png"] }
        }
    },
    {
        id: 16,
        name: "Anisakis",
        infoImage: "/images/enfermedades/Anisakis.png",
        categories: {
            agente: { text: ["Anisakis spp."], image: "/images/agente/parasito.png", images: ["/images/agente/parasito.png"] },
            transmision: { text: ["🍗 Alimentos contaminados o crudos (pescado o cefalópodos)"], image: "/images/transmision/alimentos.png", images: ["/images/transmision/alimentos.png"] },
            prevencion_ciudadana: { text: ["🍳 Buena cocción o congelación de pescado"], image: "/images/prevencion/alimentos.png", images: ["/images/prevencion/alimentos.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🤢 Digestivo: dolor abdominal, náuseas, vómitos; característico: sensación de cuerpo extraño en estómago/intestino"], image: "/images/organo/digestivo.png", images: ["/images/organo/digestivo.png"] }
        }
    },
    {
        id: 17,
        name: "Sarna",
        infoImage: "/images/enfermedades/Sarna.png",
        categories: {
            agente: { text: ["Sarcoptes scabiei"], image: "/images/agente/parasito.png", images: ["/images/agente/parasito.png"] },
            transmision: { text: ["✋ Contacto directo"], image: "/images/transmision/contacto.png", images: ["/images/transmision/contacto.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene: evitar contacto cercano"], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png", "/images/prevencion/contacto.png"] },
            prevencion_hospitalaria: { text: ["✋ Aislamiento de contacto: guantes, bata"], image: "/images/epi/contacto.png", images: ["/images/epi/contacto.png"] },
            sistema_afectado: { text: ["🧴 cutaneo: prurito intenso nocturno; característico: surcos en cutaneo con erupción"], image: "/images/organo/cutaneo.png", images: ["/images/organo/cutaneo.png"] }
        }
    },
    {
        id: 18,
        name: "Pediculosis",
        infoImage: "/images/enfermedades/Pediculosis.png",
        categories: {
            agente: { text: ["Pediculus humanus"], image: "/images/agente/parasito.png", images: ["/images/agente/parasito.png"] },
            transmision: { text: ["✋ Contacto directo"], image: "/images/transmision/contacto.png", images: ["/images/transmision/contacto.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene: no compartir objetos personales"], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png", "/images/prevencion/contacto.png"] },
            prevencion_hospitalaria: { text: ["✋ Aislamiento de contacto: guantes, bata"], image: "/images/epi/contacto.png", images: ["/images/epi/contacto.png"] },
            sistema_afectado: { text: ["🧴 cutaneo: prurito; característico: liendres adheridas al pelo"], image: "/images/organo/cutaneo.png", images: ["/images/organo/cutaneo.png"] }
        }
    },

    // 1.4 Hongo
    {
        id: 19,
        name: "Candidiasis",
        infoImage: "/images/enfermedades/Candidiasis.png",
        categories: {
            agente: { text: ["Candida albicans"], image: "/images/agente/hongo.png", images: ["/images/agente/hongo.png"] },
            transmision: { text: ["✋ Contacto sobrecrecimiento por humedad"], image: "/images/transmision/contacto.png", images: ["/images/transmision/contacto.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene: evitar humedad prolongada"], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/contacto.png", images: ["/images/epi/contacto.png"] },
            sistema_afectado: { text: ["🧴 cutaneo/mucosas: placas blancas, prurito; característico: placas blanquecinas en mucosa oral/genital. Mal olor"], image: "/images/organo/cutaneo.png", images: ["/images/organo/cutaneo.png", "/images/organo/genitourinario.png"] }
        }
    },
    {
        id: 20,
        name: "Tiña",
        infoImage: "/images/enfermedades/tina.png",
        categories: {
            agente: { text: ["Dermatofitos (Trichophyton spp.)"], image: "/images/agente/hongo.png", images: ["/images/agente/hongo.png"] },
            transmision: { text: ["✋ Contacto directo, superficies"], image: "/images/transmision/contacto.png", images: ["/images/transmision/contacto.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene: no compartir calzado/utensilios"], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/contacto.png", images: ["/images/epi/contacto.png"] },
            sistema_afectado: { text: ["🧴 cutaneo: lesiones circulares, prurito; característico: borde activo con centro más claro"], image: "/images/organo/cutaneo.png", images: ["/images/organo/cutaneo.png"] }
        }
    },
    {
        id: 21,
        name: "Onicomicosis",
        infoImage: "/images/enfermedades/onicomicosis.png",
        categories: {
            agente: { text: ["Dermatofitos / levaduras"], image: "/images/agente/hongo.png", images: ["/images/agente/hongo.png"] },
            transmision: { text: ["✋ Contacto directo"], image: "/images/transmision/contacto.png", images: ["/images/transmision/contacto.png"] },
            prevencion_ciudadana: { text: ["🧼 Higiene uñas: no compartir utensilios manicura/pedicura"], image: "/images/prevencion/higiene.png", images: ["/images/prevencion/higiene.png", "/images/prevencion/contacto.png"] },
            prevencion_hospitalaria: { text: ["Precauciones estándar"], image: "/images/epi/noprecisa.png", images: ["/images/epi/noprecisa.png"] },
            sistema_afectado: { text: ["🧴 cutaneo (uñas): engrosamiento, decoloración, fragilidad; característico: uñas amarillentas y engrosadas"], image: "/images/organo/cutaneo.png", images: ["/images/organo/cutaneo.png"] }
        }
    }
];
