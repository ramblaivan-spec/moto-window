// Listas para los desplegables y fichas de ejemplo.
// Más adelante las fichas vendrán de la base de datos (Supabase).
// Cada marca está en un solo grupo para que no se repita en los desplegables.

export const tipos = [
  { valor: 'Moto', nombre: 'Motos' },
  { valor: 'Componente', nombre: 'Componentes' },
  { valor: 'Casco', nombre: 'Cascos' },
  { valor: 'Chaqueta', nombre: 'Chaquetas' },
  { valor: 'Guantes', nombre: 'Guantes' },
  { valor: 'Botas', nombre: 'Botas' },
  { valor: 'Gafas', nombre: 'Gafas' },
  { valor: 'Ropa', nombre: 'Ropa' },
  { valor: 'Accesorio', nombre: 'Accesorios' },
  { valor: 'Herramienta', nombre: 'Herramientas' },
];

export const estilos = [
  'Café racer',
  'Scrambler',
  'Bobber',
  'Brat',
  'Custom / Cruiser',
  'Chopper',
  'Clásica',
  'Naked',
  'Streetfighter',
  'Deportiva',
  'Trail / Adventure',
  'Maxi-trail',
  'Enduro / Cross',
  'Supermotard',
  'Sport-turismo',
  'Gran turismo',
  'Scooter',
  'Eléctrica',
];

const ordenar = (lista) => [...lista].sort((a, b) => a.localeCompare(b, 'es'));

export const marcasMoto = ordenar([
  'Aprilia','Bajaj','Benelli','Beta','BMW','Brixton','BSA','Bultaco','Cagiva','CFMoto',
  'Cleveland CycleWerks','Derbi','Ducati','Energica','Fantic','GasGas','Gilera','Hanway',
  'Harley-Davidson','Honda','Husqvarna','Indian','Jawa','Kawasaki','KTM','Kymco','Lambretta',
  'Macbor','Mash','Montesa','Moto Guzzi','Mutt','MV Agusta','Norton','Ossa','Peugeot Motocycles',
  'Piaggio','QJ Motor','Rieju','Royal Enfield','Sherco','Suzuki','SYM','Triumph','TVS','Ural',
  'Vespa','Voge','Yamaha','Zero Motorcycles','Zontes',
]);

export const marcasComponentes = ordenar([
  '2in2','Daytona','Kijima','Yoshimura','Accossato','Akrapovic','Arrow','Beringer','Bitubo','Brembo','Cafe Twin','Cobra',
  'Domino','EBC','Facom','Gilles Tooling','Givi','Hagon','Highsider','Hot Rod','Kappa',
  'Kellermann','Koso','Kriega','LSL','Mass Exhaust','Motion Pro','Motogadget','Motone',
  'Ohlins','ProTaper','Renthal','Rizoma','Rotobox','SW-Motech','Termignoni','Trip Machine',
  'Vance & Hines','Vesrah','Wirth','YSS','Zard',
]);

export const marcasRopa = ordenar([
  'Airoh','Kadoya','Komine','RS Taichi','Alpinestars','Arai','AGV','Bandit','Barbour','Bell','Belstaff','Biltwell',
  'Caberg','Dainese','Davida','Furygan','Gaerne','Hedon','Held','Hevik','HJC','Iguana Custom Collection',
  'Ixon','Klim','Lewis Leathers','LS2','Merlin','Nexx','Nolan','Origine','Oxford','Pando Moto',
  'Rev\'It!','Richa','Roeg','Roland Sands Design','RST','Rukka','Saint','Schott','Schuberth',
  'Scorpion','Segura','Shark','Shoei','Sidi','Simpson','Spidi','Suomy','TCX','Torc','Vintage Worker',
]);

export const marcasTalleres = ordenar([
  'Brat Style','Cafe Racer Dreams','Chabott Engineering',"Cherry's Company",'Custom Works Zon',
  'Heiwa Motorcycle','Hide Motorcycle','Luck Motorcycles','Zero Engineering',
]);

export const marcasCalle = ordenar([
  'Bull-it','Carhartt','Deus Ex Machina','Dickies','Dr. Martens','Fuel Motorcycles','Iron & Resin',
  'Levi\'s','Pike Brothers','Red Wing','Resurgence Gear','Rokker','Timberland','Uglybros','Wrangler',
]);

// Tres secciones. Cada una tiene sus tipos y sus propias listas de marcas.
export const marcasGafas = ordenar([
  'American Optical','Barton Perreira','Bollé','Cutler and Gross','Dragon','Garrett Leight','Ic! Berlin',
  'Kaneko Optical','Masunaga','Matsuda','Moscot','Mykita','Oakley','Oliver Peoples','Persol','Randolph Engineering',
  'Ray-Ban','Revo','Shuron','Smith','Tart Optical','Wiley X',
]);

export const secciones = [
  {
    id: 'motos',
    nombre: 'Motos',
    tipos: ['Moto'],
    grupos: [
      { nombre: 'Marcas de moto', marcas: marcasMoto },
      { nombre: 'Preparadores y talleres', marcas: marcasTalleres },
    ],
  },
  {
    id: 'componentes',
    nombre: 'Accesorios y piezas',
    tipos: ['Componente', 'Accesorio', 'Herramienta'],
    grupos: [{ nombre: 'Marcas de componentes', marcas: marcasComponentes }],
  },
  {
    id: 'ropa',
    nombre: 'Ropa y equipación',
    tipos: ['Casco', 'Chaqueta', 'Guantes', 'Botas', 'Gafas', 'Ropa'],
    grupos: [
      { nombre: 'Equipación técnica', marcas: marcasRopa },
      { nombre: 'Gafas', marcas: marcasGafas },
      { nombre: 'Ropa de calle y calzado', marcas: marcasCalle },
    ],
  },
];

export const seccionDeTipo = (tipo) =>
  secciones.find((x) => x.tipos.includes(tipo)) || secciones[0];

// Mundos: colecciones comisariadas. Cada una filtra por estilos y/o marcas.
export const colecciones = [
  {
    id: 'brat',
    nombre: 'Brat Style',
    texto: 'Empezó como el nombre de un taller de Tokio, creado por Go Takamine, y acabó siendo un estilo mundial: motos limpias, bajas y sin adornos.',
    estilos: ['Brat'],
    marcas: ['Brat Style'],
  },
  {
    id: 'marcas-it',
    nombre: 'Marcas italianas',
    texto: 'Diseño y velocidad a la italiana: de Ducati, Moto Guzzi o Vespa a Dainese, Brembo, Termignoni o AGV.',
    marcas: ['Ducati', 'Moto Guzzi', 'Aprilia', 'MV Agusta', 'Benelli', 'Cagiva', 'Fantic', 'Gilera', 'Piaggio', 'Vespa', 'Lambretta', 'Dainese', 'Brembo', 'Termignoni', 'Zard', 'Spidi', 'AGV', 'Arrow', 'Nolan', 'Givi', 'Kappa', 'Rizoma', 'Airoh', 'Suomy', 'Caberg', 'Sidi', 'Gaerne', 'Accossato', 'Bitubo'],
  },
  {
    id: 'marcas-uk',
    nombre: 'Marcas británicas',
    texto: 'La tradición del café racer: Triumph, Norton o BSA, con cuero encerado de Belstaff, Barbour o Lewis Leathers.',
    marcas: ['Triumph', 'Norton', 'BSA', 'Belstaff', 'Barbour', 'Lewis Leathers', 'Merlin', 'Oxford', 'Davida', 'Hedon', 'Hagon', 'Renthal', 'Kriega'],
  },
  {
    id: 'marcas-es',
    nombre: 'Marcas españolas',
    texto: 'Las históricas, como Montesa, Bultaco u Ossa, y el estilo custom de casa, con Cafe Racer Dreams o Iguana Custom Collection.',
    marcas: ['Montesa', 'Bultaco', 'Ossa', 'Derbi', 'GasGas', 'Rieju', 'Macbor', 'Cafe Racer Dreams', 'Iguana Custom Collection', 'Hevik'],
  },
];

export const fichas = [
  { id: 1, titulo: "Negro mate y cuero", tipo: "Moto", marca: "Yamaha", modelo: "XSR700", estilo: "Café racer", alto: 1.3, tono: 0 },
  { id: 2, titulo: "Aventura en tonos tierra", tipo: "Moto", marca: "BMW", modelo: "R 1300 GS", estilo: "Maxi-trail", alto: 0.85, tono: 1 },
  { id: 3, titulo: "Pista y color", tipo: "Moto", marca: "Ducati", modelo: "Panigale V2", estilo: "Deportiva", alto: 1.15, tono: 2 },
  { id: 4, titulo: "Ciudad de noche", tipo: "Moto", marca: "Honda", modelo: "CB650R", estilo: "Naked", alto: 1.4, tono: 3 },
  { id: 5, titulo: "Clásica de los años 70", tipo: "Moto", marca: "Honda", modelo: "CB750", estilo: "Clásica", alto: 1, tono: 0 },
  { id: 6, titulo: "Scrambler de fin de semana", tipo: "Moto", marca: "Ducati", modelo: "Scrambler Icon", estilo: "Scrambler", alto: 1.25, tono: 1 },
  { id: 7, titulo: "Naked limpia y sin ruido", tipo: "Moto", marca: "Triumph", modelo: "Street Triple", estilo: "Naked", alto: 0.9, tono: 2 },
  { id: 8, titulo: "Custom hecha a mano", tipo: "Moto", marca: "Harley-Davidson", modelo: "Sportster", estilo: "Custom / Cruiser", alto: 1.35, tono: 3 },
  { id: 9, titulo: "Brat de taller", tipo: "Moto", marca: "Suzuki", modelo: "SV650", estilo: "Brat", alto: 1.1, tono: 0 },
  { id: 10, titulo: "Largas distancias con estilo", tipo: "Moto", marca: "BMW", modelo: "R 1250 RT", estilo: "Gran turismo", alto: 0.8, tono: 1 },
  { id: 11, titulo: "Café racer de taller", tipo: "Moto", marca: "BMW", modelo: "R nineT", estilo: "Café racer", alto: 1.2, tono: 2 },
  { id: 12, titulo: "Supersport de carbono", tipo: "Moto", marca: "Aprilia", modelo: "RSV4", estilo: "Deportiva", alto: 1.45, tono: 3 },
  { id: 13, titulo: "Vintage restaurada", tipo: "Moto", marca: "Yamaha", modelo: "XT 500", estilo: "Clásica", alto: 0.95, tono: 0 },
  { id: 14, titulo: "Scrambler en blanco y negro", tipo: "Moto", marca: "Husqvarna", modelo: "Svartpilen 401", estilo: "Scrambler", alto: 1.3, tono: 1 },
  { id: 15, titulo: "Bobber de líneas puras", tipo: "Moto", marca: "Triumph", modelo: "Bonneville Bobber", estilo: "Bobber", alto: 1.05, tono: 2 },
  { id: 16, titulo: "Naked deportiva", tipo: "Moto", marca: "Kawasaki", modelo: "Z900", estilo: "Naked", alto: 1.2, tono: 3 },
  { id: 17, titulo: "Trail ligera para pista de tierra", tipo: "Moto", marca: "KTM", modelo: "790 Adventure", estilo: "Trail / Adventure", alto: 1.35, tono: 0 },
  { id: 18, titulo: "Clásica italiana", tipo: "Moto", marca: "Moto Guzzi", modelo: "V7", estilo: "Clásica", alto: 0.85, tono: 1 },
  { id: 19, titulo: "Ciudad en tonos grises", tipo: "Moto", marca: "Vespa", modelo: "GTS", estilo: "Scooter", alto: 1.15, tono: 2 },
  { id: 20, titulo: "Casco de líneas retro", tipo: "Casco", marca: "Shoei", modelo: "Glamster", estilo: "Clásica", alto: 1, tono: 3 },
  { id: 21, titulo: "Casco abierto básico", tipo: "Casco", marca: "Biltwell", modelo: "Gringo SV", estilo: "Café racer", alto: 1.1, tono: 0 },
  { id: 22, titulo: "Cuero encerado", tipo: "Chaqueta", marca: "Belstaff", modelo: "Trialmaster", estilo: "Clásica", alto: 1.3, tono: 1 },
  { id: 23, titulo: "Chaqueta de taller", tipo: "Chaqueta", marca: "Lewis Leathers", modelo: "Lightning", estilo: "Café racer", alto: 1.2, tono: 2 },
  { id: 24, titulo: "Guantes de piel fina", tipo: "Guantes", marca: "Dainese", modelo: "Mig 3", estilo: "Café racer", alto: 0.85, tono: 3 },
  { id: 25, titulo: "Cuadro de mandos mínimo", tipo: "Accesorio", marca: "Motogadget", modelo: "m.Blaze", estilo: "Brat", alto: 0.8, tono: 0 },
  { id: 26, titulo: "Equipaje para trail", tipo: "Accesorio", marca: "Kriega", modelo: "US-20", estilo: "Trail / Adventure", alto: 1, tono: 1 },
  { id: 27, titulo: "Llave dinamométrica", tipo: "Herramienta", marca: "Facom", modelo: "", estilo: "Clásica", alto: 0.9, tono: 2 },
  { id: 28, titulo: 'Escape slip-on cepillado', tipo: 'Componente', marca: 'Zard', modelo: '', estilo: 'Café racer', alto: 0.85, tono: 3 },
  { id: 29, titulo: 'Amortiguadores traseros', tipo: 'Componente', marca: 'YSS', modelo: '', estilo: 'Clásica', alto: 1.1, tono: 0 },
  { id: 30, titulo: 'Botas urbanas de piel', tipo: 'Botas', marca: 'TCX', modelo: '', estilo: 'Brat', alto: 1, tono: 1 },
  { id: 31, titulo: 'Chaqueta encerada', tipo: 'Chaqueta', marca: 'Barbour', modelo: '', estilo: 'Clásica', alto: 1.25, tono: 2 },
  { id: 32, titulo: 'Camiseta de taller', tipo: 'Ropa', marca: 'Vintage Worker', modelo: '', estilo: 'Custom / Cruiser', alto: 0.9, tono: 3 },
  { id: 33, titulo: 'Pantalón de trabajo para rodar', tipo: 'Ropa', marca: 'Dickies', modelo: '', estilo: 'Brat', alto: 1.3, tono: 0 },
  { id: 34, titulo: 'Botas de trabajo', tipo: 'Botas', marca: 'Red Wing', modelo: '', estilo: 'Café racer', alto: 0.95, tono: 1 },
  { id: 35, titulo: 'Casco jet retro', tipo: 'Casco', marca: 'Hedon', modelo: '', estilo: 'Café racer', alto: 1.05, tono: 2 },
  { id: 36, titulo: 'Manillar alto y cola larga', tipo: 'Moto', marca: 'Honda', modelo: 'CB400 Four', estilo: 'Custom / Cruiser', alto: 1.3, tono: 0 },
  { id: 37, titulo: 'Pintura vistosa y carenado enorme', tipo: 'Moto', marca: 'Kawasaki', modelo: 'Z400FX', estilo: 'Custom / Cruiser', alto: 1.15, tono: 1 },
  { id: 38, titulo: 'Z1 de época', tipo: 'Moto', marca: 'Kawasaki', modelo: 'Z1', estilo: 'Clásica', alto: 1.1, tono: 2 },
  { id: 39, titulo: 'Clásica de los 80 con piezas originales', tipo: 'Moto', marca: 'Suzuki', modelo: 'GS400', estilo: 'Clásica', alto: 0.9, tono: 3 },
  { id: 40, titulo: 'Brat con asiento plano', tipo: 'Moto', marca: 'Honda', modelo: 'CB400', estilo: 'Brat', alto: 1.25, tono: 0 },
  { id: 41, titulo: 'Escape para una clásica japonesa', tipo: 'Componente', marca: 'Yoshimura', modelo: '', estilo: 'Clásica', alto: 0.85, tono: 1 },
  { id: 42, titulo: 'Chaqueta de piel japonesa', tipo: 'Chaqueta', marca: 'Kadoya', modelo: '', estilo: 'Clásica', alto: 1.2, tono: 2 },
  { id: 43, titulo: 'Custom de taller en Tokio', tipo: 'Moto', marca: "Cherry's Company", modelo: '', estilo: 'Custom / Cruiser', alto: 1.35, tono: 3 },
  { id: 44, titulo: 'Zero style', tipo: 'Moto', marca: 'Chabott Engineering', modelo: '', estilo: 'Custom / Cruiser', alto: 1, tono: 0 },
  { id: 45, titulo: 'Trial de colección', tipo: 'Moto', marca: 'Montesa', modelo: 'Cota 247', estilo: 'Clásica', alto: 0.9, tono: 1 },
  { id: 46, titulo: 'Chaqueta custom de tienda', tipo: 'Chaqueta', marca: 'Iguana Custom Collection', modelo: '', estilo: 'Custom / Cruiser', alto: 1.2, tono: 2 },
  { id: 47, titulo: 'Gafas de carey para rodar', tipo: 'Gafas', marca: 'Persol', modelo: '714', estilo: 'Clásica', alto: 0.85, tono: 1 },
  { id: 48, titulo: 'Aviador clásico', tipo: 'Gafas', marca: 'Ray-Ban', modelo: 'Aviator', estilo: 'Café racer', alto: 0.9, tono: 3 },
];
