import "./InfoPersonaje.css"; 

const InfoPersonaje = () => {
  return (
    <div className="character-card-fixed">
      <div className="card looney-card text-white">
        <div className="card-body p-4">
          <h2 className="card-title text-center">Bugs Bunny</h2>
          <p className="card-text mt-3">
           Bugs Bunny es el conejo más cool de los dibujos animados. Siempre con una zanahoria en la mano y una sonrisa pícara en la cara, este maestro del sarcasmo no se deja atrapar fácilmente. Le encanta burlarse de sus enemigos con su frase legendaria: "¿Qué hay de nuevo, viejo?" y siempre encuentra la forma más ingeniosa de salirse con la suya. Ya sea enfrentando al Pato Lucas o a Marvin el Marciano, Bugs siempre gana... ¡sin despeinarse ni una oreja!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPersonaje;