
const Rank = ({name,entries}) => {
	return(
		<>
			<div className='white f3'>
				{`${name}, your entry count is...`}
			</div>
			<div className='white f1'>
				{entries}
			</div>
		</>

	);
}

export default Rank