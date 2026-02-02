
import { useState, useEffect } from 'react'
import ParticlesBg from 'particles-bg'
import Navigation from './components/navigation/Navigation'; 
import Logo from './components/logo/Logo'; 
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank'; 
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import './App.css';

  const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
  isSignIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

function App() {

const [input, setInput] = useState(initialState.input);
const [imageUrl, setImageUrl] = useState(initialState.imageUrl);
const [box, setBox] = useState(initialState.box);
const [route, setRoute] = useState(initialState.route);
const [isSignIn, setIsSignIn] = useState(initialState.isSignIn);
const [user, setUser] = useState(initialState.user);

 

const loadUser = (data) => {
  setUser({
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  });
};

const calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

 const displayFaceBox = (box) => {
  setBox(box);
 }

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
  setImageUrl(input);

  fetch('https://smartbrains-1.onrender.com/imageurl', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: input
    })
  })
  .then(res => res.json())
  .then(response => {
    console.log('CLARIFAI RAW:', response);   // 👈 AQUI vemos si Clarifai devuelve caras

    // Calculamos el box
    const box = calculateFaceLocation(response);
    console.log('BOX:', box);                 // 👈 AQUI vemos si sale NaN o valores reales
    displayFaceBox(box);

    // Solo si hubo respuesta válida, actualizamos entries
    if (response && user.id) {
      fetch('https://smartbrains-1.onrender.com/image', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id
        })
      })
      .then(res => res.json())
      .then(count => {
        setUser(prev => ({ ...prev, entries: count }))
      });
    }
  })
  .catch(console.log);
};




  const Particles = () => (
    <>
      <ParticlesBg type="cobweb" bg={true} />
    </>
  );

const onRouteChange = (route) => {
  if (route === 'signout') {
    // Reinicia todo el estado al inicial
    setInput(initialState.input);
    setImageUrl(initialState.imageUrl);
    setBox(initialState.box);
    setUser(initialState.user);
    setIsSignIn(initialState.isSignIn);
    setRoute(initialState.route); // Aquí vuelve a 'SignIn'
  } else if (route === 'home') {
    setIsSignIn(true);
    setRoute('home');
  } else {
    setRoute(route);
  }
};
  return (
    <>
      <Particles />
      <Navigation isSignIn={isSignIn} onRouteChange= {onRouteChange} />
      { route === 'home' 
        ? <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
          : ( route === 'SignIn' 

            ? <SignIn onRouteChange = {onRouteChange}
                      loadUser={loadUser}
              /> 
            : <Register loadUser={loadUser} onRouteChange = {onRouteChange} />
          )
         
      }
    </>
  );
}

export default App;
