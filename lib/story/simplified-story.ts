export type StoryNodeType = 'scene' | 'choice' | 'end' | 'attestation';

export interface StoryNode {
  id: string;
  type: StoryNodeType;
  title?: string;
  content: {
    messages?: string[];
    image?: string;
    video?: string;
    interactive?: boolean;
    notification?: string;
    fade?: { direction: 'in' | 'out'; to?: string };
    attestation?: boolean;
    features?: { name: 'maps' | 'notes' | 'menu'; enabled: boolean }[];
  };
  choices?: {
    text: string;
    nextNodeId: string;
    requirements?: string[];
  }[];
  autoAdvance?: string;
}

export const owlStory: StoryNode[] = [
  {
    id: 'f73a4b1f-1c1c-45be-89d9-08ef256cfec9',
    type: 'scene',
    title: 'Inicio',
    content: {
      video: 'intro',
      interactive: true
    },
    choices: [
      { text: 'Continuar', nextNodeId: '5f050da7-ccdc-4c5f-b17e-83c6d5981c05' }
    ]
  },

  {
    id: '5f050da7-ccdc-4c5f-b17e-83c6d5981c05',
    type: 'choice',
    title: 'Habitación de Val',
    content: {
      image: 'mapValRoom'
    },
    choices: [
      { text: 'Ir a la puerta', nextNodeId: '1bba4f77-2581-445b-b942-3f117ef7729d' },
      { text: 'Tropezar con la alfombra', nextNodeId: '746cdb5c-6d3c-43d1-ad1b-0cee4c6a0117' },
      { text: 'Estar en cama', nextNodeId: '85c089f9-3c96-45fa-9ecb-d1319bd5b945' }
    ]
  },

  {
    id: '85c089f9-3c96-45fa-9ecb-d1319bd5b945',
    type: 'scene',
    title: 'En la cama',
    content: {
      messages: ['No me puedo quedar en cama. Debería ir a ver qué necesita papá.']
    },
    autoAdvance: '5f050da7-ccdc-4c5f-b17e-83c6d5981c05'
  },

  {
    id: '746cdb5c-6d3c-43d1-ad1b-0cee4c6a0117',
    type: 'scene',
    title: 'Tropezar con alfombra',
    content: {
      messages: [
        '¡AUCH!',
        'Antes de poder pensar qué querrá papá, te tropiezas con la alfombra y peleas contra la gravedad hasta terminar en la puerta y recuperar tu balance.'
      ]
    },
    autoAdvance: '1bba4f77-2581-445b-b942-3f117ef7729d'
  },

  {
    id: '1bba4f77-2581-445b-b942-3f117ef7729d',
    type: 'choice',
    title: 'Primer piso',
    content: {
      image: 'mapDownstairs'
    },
    choices: [
      { text: 'Barra de cocina', nextNodeId: 'e3c43fe5-a9c2-4942-8397-922710f1ec1a' },
      { text: 'Taller (puerta 1)', nextNodeId: 'e8e953b4-744f-41b0-a55c-77345f5e06fd' },
      { text: 'Habitación papá (puerta 2)', nextNodeId: '1fb1c2b0-0d74-4f13-ba4d-2a1aa92c7c78' },
      { text: 'Puerta principal', nextNodeId: '11b0c1af-aafd-497e-b38f-f3549302c811' }
    ]
  },

  {
    id: '11b0c1af-aafd-497e-b38f-f3549302c811',
    type: 'scene',
    title: 'Intentar salir',
    content: {
      messages: ['No debería salir de casa todavía. ¿Dónde está papá?']
    },
    autoAdvance: '1bba4f77-2581-445b-b942-3f117ef7729d'
  },

  {
    id: 'e8e953b4-744f-41b0-a55c-77345f5e06fd',
    type: 'scene',
    title: 'Taller vacío',
    content: {
      image: 'workshopEmpty'
    },
    autoAdvance: '1bba4f77-2581-445b-b942-3f117ef7729d'
  },

  {
    id: '1fb1c2b0-0d74-4f13-ba4d-2a1aa92c7c78',
    type: 'scene',
    title: 'Habitación de papá',
    content: {
      image: 'imageDadRoom'
    },
    autoAdvance: 'c9230d0d-9a53-4f26-98af-fc836c71eb57'
  },

  {
    id: 'c9230d0d-9a53-4f26-98af-fc836c71eb57',
    type: 'scene',
    content: {
      image: 'mapDownstairs'
    },
    autoAdvance: '1bba4f77-2581-445b-b942-3f117ef7729d'
  },

  {
    id: 'e3c43fe5-a9c2-4942-8397-922710f1ec1a',
    type: 'scene',
    title: 'Hablando con papá',
    content: {
      image: 'mapDownstairs2'
    },
    autoAdvance: 'c914290f-2ce3-4418-a674-17a27ba942aa'
  },

  {
    id: 'c914290f-2ce3-4418-a674-17a27ba942aa',
    type: 'scene',
    title: 'Instrucciones de papá',
    content: {
      messages: [
        'Gracias por llegar tan rápido, Val. Tengo algo importante que encargarte.',
        'Hoy es la coronación de la nueva reina, Mipha, y necesitamos llevarle un regalo de parte nuestra.',
        'Entra al taller, escoge la escultura que más te guste y llévala de inmediato a la ceremonia.'
      ]
    },
    autoAdvance: '85e3638c-05a0-4336-8295-8b052b1fb782'
  },

  {
    id: '85e3638c-05a0-4336-8295-8b052b1fb782',
    type: 'choice',
    title: 'Primer piso con papá',
    content: {
      image: 'mapDownstairs2'
    },
    choices: [
      { text: 'Puerta 1', nextNodeId: 'dbf8af7d-e7da-4af5-ba48-d9be57d1c6f0' },
      { text: 'Puerta 2', nextNodeId: 'b9b16b46-c094-42ce-af67-173f3908fccd' },
      { text: 'Puerta principal', nextNodeId: '98f74305-ba4c-4ae2-9e6d-561ca2f17e8a' }
    ]
  },

  {
    id: '98f74305-ba4c-4ae2-9e6d-561ca2f17e8a',
    type: 'scene',
    content: {
      messages: ['No puedo salir de casa sin la escultura. Val... ¡enfócate!']
    },
    autoAdvance: '85e3638c-05a0-4336-8295-8b052b1fb782'
  },

  {
    id: 'b9b16b46-c094-42ce-af67-173f3908fccd',
    type: 'scene',
    content: {
      image: 'mapDownstairs2'
    },
    autoAdvance: '5f7d1e29-713b-4497-940f-1af155f918c6'
  },

  {
    id: '5f7d1e29-713b-4497-940f-1af155f918c6',
    type: 'scene',
    content: {
      image: 'mapDownstairs2'
    },
    autoAdvance: '85e3638c-05a0-4336-8295-8b052b1fb782'
  },

  {
    id: 'dbf8af7d-e7da-4af5-ba48-d9be57d1c6f0',
    type: 'choice',
    title: 'Taller con esculturas',
    content: {
      image: 'mapWorkshop2'
    },
    choices: [
      { text: 'Escultura de búho', nextNodeId: 'd8a1faba-1ae7-4eb5-a790-83c210cf354a' },
      { text: 'Otra escultura', nextNodeId: 'cac0e514-d66b-4b66-a804-989455f0f80f' },
      { text: 'Salir del taller', nextNodeId: 'ba8e2768-3283-4160-819f-3af98f55abdb' }
    ]
  },

  {
    id: 'ba8e2768-3283-4160-819f-3af98f55abdb',
    type: 'scene',
    content: {
      messages: ['No puedo salir sin llevar una escultura.']
    },
    autoAdvance: 'dbf8af7d-e7da-4af5-ba48-d9be57d1c6f0'
  },

  {
    id: 'd8a1faba-1ae7-4eb5-a790-83c210cf354a',
    type: 'scene',
    content: {
      image: 'mapDownstairs2'
    },
    autoAdvance: '428c2edd-d717-42ae-a875-52819ca81459'
  },

  {
    id: '428c2edd-d717-42ae-a875-52819ca81459',
    type: 'scene',
    content: {
      messages: ['¡Definitivamente, ¡una obra de arte! Ahora sí: a la coronación.']
    },
    autoAdvance: '88b2a741-3980-42ef-8d20-9c917ae30d4b'
  },

  {
    id: 'cac0e514-d66b-4b66-a804-989455f0f80f',
    type: 'scene',
    content: {
      image: 'mapDownstairs2'
    },
    autoAdvance: 'bdf5f854-8d25-43c1-b2ec-00c28c03e112'
  },

  {
    id: 'bdf5f854-8d25-43c1-b2ec-00c28c03e112',
    type: 'scene',
    content: {
      messages: ['Pues no es la mejor que he visto, pero debo irme ya si quiero llegar a tiempo. ¡A la coronación!']
    },
    autoAdvance: '596fa2be-f536-4433-b0ff-c157fd6dbfa5'
  },

  {
    id: '88b2a741-3980-42ef-8d20-9c917ae30d4b',
    type: 'attestation',
    title: 'Attestation - Búho',
    content: {
      attestation: true
    },
    autoAdvance: '31f5b119-10f4-431f-a260-35d5b34ff780'
  },

  {
    id: '596fa2be-f536-4433-b0ff-c157fd6dbfa5',
    type: 'attestation',
    title: 'Attestation - Otra escultura',
    content: {
      attestation: true
    },
    autoAdvance: '31f5b119-10f4-431f-a260-35d5b34ff780'
  },

  {
    id: '31f5b119-10f4-431f-a260-35d5b34ff780',
    type: 'choice',
    title: 'Territorio',
    content: {
      image: 'mapTerritory',
      fade: { direction: 'out' }
    },
    choices: [
      { text: 'Castillo', nextNodeId: '05898def-82c0-4919-9c83-25ff4e80a7de' },
      { text: 'Museo', nextNodeId: 'a7b7051a-d0e2-4467-b653-8bd65bb7bdd2' },
      { text: 'Pueblo', nextNodeId: 'ae21d001-9e98-4827-b0de-0abb5c7ef354' }
    ]
  },

  {
    id: 'ae21d001-9e98-4827-b0de-0abb5c7ef354',
    type: 'scene',
    content: {
      messages: ['No hay nadie en el pueblo, mejor voy al castillo para la coronación.']
    },
    autoAdvance: '31f5b119-10f4-431f-a260-35d5b34ff780'
  },

  {
    id: 'a7b7051a-d0e2-4467-b653-8bd65bb7bdd2',
    type: 'scene',
    content: {
      messages: ['El museo está cerrado. Parece que todos se fueron a la coronación.']
    },
    autoAdvance: '31f5b119-10f4-431f-a260-35d5b34ff780'
  },

  {
    id: '05898def-82c0-4919-9c83-25ff4e80a7de',
    type: 'scene',
    title: 'Llegada al castillo',
    content: {
      video: 'StoryVideo1'
    },
    autoAdvance: '5d3137e0-fa2f-4415-bca5-3d4b6dd958b3'
  },

  {
    id: '5d3137e0-fa2f-4415-bca5-3d4b6dd958b3',
    type: 'attestation',
    title: 'Attestation - Castillo',
    content: {
      attestation: true
    },
    autoAdvance: 'e011d2ee-b8d3-419c-8366-5841d92724ee'
  },

  {
    id: 'e011d2ee-b8d3-419c-8366-5841d92724ee',
    type: 'choice',
    title: 'Encuentro con Mipha',
    content: {
      messages: [
        'Mipha: Como puedes ver, es imprescindible la firma de este trato y sólo tú me puedes ayudar a salvar no sólo esta nación, sino ambas. La guerra no puede continuar.',
        'Mipha: Si decides unirte, necesito que hagas la atestación con tu Marca de Vida y así sellar nuestro trato.'
      ]
    },
    choices: [
      { text: 'Atestar', nextNodeId: 'd389231b-d214-409e-bfaf-a7febf327574' }
    ]
  },

  {
    id: 'd389231b-d214-409e-bfaf-a7febf327574',
    type: 'attestation',
    title: 'Atestación con Mipha',
    content: {
      attestation: true
    },
    autoAdvance: '063f730b-3e20-45fb-aeb6-8edc408a67dc'
  },

  {
    id: '063f730b-3e20-45fb-aeb6-8edc408a67dc',
    type: 'scene',
    content: {
      video: 'StoryVideo2'
    },
    autoAdvance: '89d109a0-2b30-417b-98c1-756fe80fba78'
  },

  {
    id: '89d109a0-2b30-417b-98c1-756fe80fba78',
    type: 'choice',
    title: 'Mazmorra',
    content: {
      image: 'mapDungeon',
      fade: { direction: 'in' }
    },
    choices: [
      { text: 'Menu', nextNodeId: 'ce08f869-5b30-4e71-8617-7336cda7dd6b' },
      { text: 'Puerta derecha', nextNodeId: 'dda1f930-371b-4d4b-8ddc-3eb5c1e85782' }
    ]
  },

  {
    id: 'dda1f930-371b-4d4b-8ddc-3eb5c1e85782',
    type: 'scene',
    content: {
      messages: ['Continúas a la actividad de pronunciación...']
    },
    autoAdvance: 'learning-activity'
  },

  {
    id: 'ce08f869-5b30-4e71-8617-7336cda7dd6b',
    type: 'scene',
    content: {
      features: [{ name: 'maps', enabled: true }]
    },
    autoAdvance: '300f05c5-ea91-4a5d-bfb8-59ad254dc8d4'
  },

  {
    id: '300f05c5-ea91-4a5d-bfb8-59ad254dc8d4',
    type: 'scene',
    content: {
      messages: ['Mostrar todos los mapas visitados, listando el más reciente primero.']
    },
    autoAdvance: 'f68d38fd-f5a8-4295-af04-b61535f72499'
  },

  {
    id: 'f68d38fd-f5a8-4295-af04-b61535f72499',
    type: 'choice',
    content: {
      messages: ['Selecciona un mapa:']
    },
    choices: [
      { text: 'Museo', nextNodeId: 'f6169895-f83f-4b92-b167-06c04ed08323' }
    ]
  },

  {
    id: 'f6169895-f83f-4b92-b167-06c04ed08323',
    type: 'scene',
    content: {
      video: 'StoryVideo3'
    },
    autoAdvance: '8d029772-0dc6-40ee-b3e3-accaccdd3c1a'
  },

  {
    id: '8d029772-0dc6-40ee-b3e3-accaccdd3c1a',
    type: 'choice',
    title: 'Actividad del Museo',
    content: {
      messages: ['Actividad: Toca las palabras en el orden que desees para crear una frase. La idea es reconstruir la fuente usando las piezas rotas.']
    },
    choices: [
      { text: '🏛️ Comenzar Actividad', nextNodeId: 'museum-activity' }
    ]
  },

  {
    id: 'museum-activity-return',
    type: 'attestation',
    title: 'Actividad completada',
    content: {
      attestation: true
    },
    autoAdvance: '0df2f5f4-5ce6-43c5-9671-78f9acefca3f'
  },

  {
    id: '16717297-4c58-4f83-ad41-6445619a59fa',
    type: 'attestation',
    title: 'Actividad completada',
    content: {
      attestation: true
    },
    autoAdvance: '0df2f5f4-5ce6-43c5-9671-78f9acefca3f'
  },

  {
    id: '0df2f5f4-5ce6-43c5-9671-78f9acefca3f',
    type: 'scene',
    content: {
      messages: ['Gráficos para el menú mostrando las lecciones de video y notas desbloqueadas.']
    },
    autoAdvance: '9acca0b9-76e7-4cb9-802e-5e80e249bf52'
  },

  {
    id: '9acca0b9-76e7-4cb9-802e-5e80e249bf52',
    type: 'scene',
    content: {
      messages: ['Si el jugador selecciona VideoLesson1, reproduce el video y habilita notas en la parte inferior.']
    },
    autoAdvance: 'e47dd72f-a112-4745-9945-63ca42aed89f'
  },

  {
    id: 'e47dd72f-a112-4745-9945-63ca42aed89f',
    type: 'scene',
    content: {
      messages: ['Collar (barra de progreso) completado + pieza 1/4']
    },
    autoAdvance: '7368f6fd-1437-4356-bcf9-5f88228ff23f'
  },

  {
    id: '7368f6fd-1437-4356-bcf9-5f88228ff23f',
    type: 'scene',
    content: {
      notification: 'Es hora de volver al castillo'
    },
    autoAdvance: '7d04e146-c2c9-4d49-9a2f-594a31269682'
  },

  {
    id: '7d04e146-c2c9-4d49-9a2f-594a31269682',
    type: 'scene',
    content: {
      messages: ['El jugador debe abrir menú, mapas, MapTerritory, regresar al castillo']
    },
    autoAdvance: '33a917e3-1a38-48b3-9ff0-51a2c852aede'
  },

  {
    id: '33a917e3-1a38-48b3-9ff0-51a2c852aede',
    type: 'scene',
    content: {
      video: 'StoryVid5'
    },
    autoAdvance: '59473fad-b00b-4721-8e33-a5734c28ba58'
  },

  {
    id: '59473fad-b00b-4721-8e33-a5734c28ba58',
    type: 'end',
    title: 'The End',
    content: {
      messages: ['¡Felicidades! Has completado la historia de OWL.']
    }
  }
];

export function findStoryNode(nodeId: string): StoryNode | undefined {
  return owlStory.find(node => node.id === nodeId);
}

export function getNextNode(currentNodeId: string, choiceIndex?: number): string | undefined {
  const currentNode = findStoryNode(currentNodeId);
  
  if (!currentNode) return undefined;
  
  
  if (currentNode.autoAdvance) {
    return currentNode.autoAdvance;
  }
  
  
  if (currentNode.choices && choiceIndex !== undefined) {
    return currentNode.choices[choiceIndex]?.nextNodeId;
  }
  
  return undefined;
}
