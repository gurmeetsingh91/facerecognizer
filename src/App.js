import './App.css';
import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import { useCallback } from "react";
import Particles from "react-tsparticles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import FaceRecognition from './components/FaceRecognition/FaceRecognition';



const MyParticleComponent = ()=> {

  const particleOptions = {
        fullScreen:{
          enable:true,
          zIndex:-1,
        },
          fpsLimit: 120,
          interactivity: {
              events:{
                onHover:{
                  enable:true,
                  mode:"grab"
                },
                onClick:{
                  enable:true,
                  mode:"repulse"
                }
  
              }
          
             
          },
          particles: {
              color: {
                  value: "#ffffff",
              },
              links: {
                  color: "#ffffff",
                  distance: 125,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
              },
              move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                      default: "bounce",
                  },
                  random: true,
                  speed: 3,
                  straight: false,
              },
              number: {
                  density: {
                      enable: true,
                      area: 1000,
                  },
                  value: 90,
              },
              opacity: {
                  value: 0.5,
              },
              shape: {
                  type: "triangle",
              },
              size: {
                  value: { min: 1, max: 5 },
              },
          },
          detectRetina: true,
      }
    
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);
    
    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);
  
  return (
    <Particles
              id="tsparticles"
              init={particlesInit}
              loaded={particlesLoaded}
              options={particleOptions}/>
  )
  
  
  }



class App extends Component {

  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{}
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    console.log("input changed")
    this.setState({imageUrl:event.target.value})
  }


  calculateFaceBoxLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log("width: ",width)
    console.log("height: ",height)


    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {

    console.log("box dim: ",box)
    this.setState({box: box});
  }


   onButtonSubmit = async() => {
    
    

    ////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, app ID, and input URL. 
    // Change these strings to run your own example.
    ////////////////////////////////////////////////////////////////////////////////////

      // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '5d112d50fb474ce98d5133325cddf9a6';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';       
    const APP_ID = 'main';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';     
    const IMAGE_URL = this.state.imageUrl;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT, 
        
    },
    body: raw
  };

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  try {
    const response = await fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      requestOptions
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please check your API key.');
      } else if (response.status === 404) {
        throw new Error('Resource not found.');
      } else {
        throw new Error('Network response was not ok');
      }
    }

    const data = await response.json();

    // Assuming 'this' refers to the correct context (e.g., a React component)
    this.displayFaceBox(this.calculateFaceBoxLocation(data));
  } catch (error) {
    console.error('Error:', error);
  }


  }


  render() {

   

  return (

    <div className="App">
      
      <MyParticleComponent/>

      <Navigation/>
       <Logo/>
       <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} onPaste={this.onPasteChange}/>
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
    </div>
  )};
}

export default App;
