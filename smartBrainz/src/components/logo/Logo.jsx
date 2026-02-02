import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
	return(
	<div className= 'ma4 mt0'>	
		<Tilt 
			className="tilt-img br2 shadow-2 tc pa3"
    		tiltMaxAngleX={35}
    		tiltMaxAngleY={35}
    		perspective={900}
    		scale={1.1}
    		transitionSpeed={2000}
    		gyroscope={true}>

      			<div >
        			<img alt='logo' src={brain}/>
      			</div>
    	</Tilt>
    </div>
	);
}



export default Logo;