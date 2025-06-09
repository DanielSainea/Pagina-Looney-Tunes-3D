const InicioCard = () => {
return (
        <div className="container">
            <div className="glass-box">
              <h1>¡Bienvenido al mundo de Looney Tunes!</h1>
              <p>Explora una página interactiva donde podrás disfrutar modelos 3D de tus personajes favoritos como nunca antes los habías visto:</p>
                <ul className="list-unstyled">
                  <li>¡El divertido <strong>Bugs Bunny</strong>!</li>
                  <li>¡<strong>Pato Lucas</strong> en su versión espacial!</li>
                  <li>¡La encantadora <strong>Lola Bunny</strong>!</li>
                  <p>Por medio de las librerias Three.js, Motion y Particles.js se crearon modelos,escenarios,particulas y otros objetos para crear una composicion
                    correcta para los Looney Tunes.
                  </p>
                </ul>
            </div>
        </div>
        );
 };

export default InicioCard;