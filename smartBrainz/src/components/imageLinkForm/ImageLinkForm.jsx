import './ImageLinkForm.css';


const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return(
		<>
			<p className='f3 center'>
				{'This magic Brain will detect faces in your pictures. Give it a Try!'}
			</p>
			<div className=' center'>
				<div className='pa4 br3 shadow-5 center form'>
					<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/> 
					<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' 
							onClick={onButtonSubmit}
					>
						Detect
					</button>
				</div>
			</div>

		</>
	
	);

}

export default ImageLinkForm;