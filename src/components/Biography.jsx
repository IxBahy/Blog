import { useEffect, useRef, useState } from "react";

export const Biography = () => {
	const biographiesArray = [
		`Mohamed writes good articles`,
		`Mohamed is in love with web development, especially frontend he writes
        about JavaScript and soon about CSS and other topics related`,
		`Mohamed is a computer science student and is an enthusiastic web dev,
        he is currently learning JavaScript and other related web languages,tools, and topics and 
        will hopefully share all that he learns in this journey with you in articles so stay tuned`,
		`Mohamed is a software engineer that respects the quality of the code and the cleanness of it
        and a very passionate Web developer that keeps up with all the new trends in development and the JavaScript
        frameworks and open to use and learn different tech to solve problems in a more efficient way and will write about all this in here.\nhe mainly works with React but he's flexable with the choices, he has some knowledge in the backend and in the design patterns too
        and also a certified AWS practitioner`,
	];
	const [currentBio, setCurrentBio] = useState(1);
	const [biography, setBiography] = useState(biographiesArray[1]);
	const bioRef = useRef(null);
	useEffect(() => {
		printTextLetters(0, true);
	}, [biography]);
	const handleBioChange = (e) => {
		const bioType = e.target.value;
		switch (bioType) {
			case "shortest":
				updateBio(0);
				break;
			case "short":
				updateBio(1);
				break;
			case "long":
				updateBio(2);
				break;
			case "longest":
				updateBio(3);
				break;

			default:
				break;
		}
	};
	const updateBio = (bioIndex) => {
		bioRef.current.innerHTML = "";
		setBiography(biographiesArray[bioIndex]);
		setCurrentBio(bioIndex);
	};
	const printTextLetters = (index, firstRun = false) => {
		if (firstRun) {
			disableRadioButtons(true);
		}
		if (index < biography.length) {
			bioRef.current.innerHTML += biography.charAt(index);
			index++;
			setTimeout(() => {
				printTextLetters(index);
			}, 20);
		} else {
			console.log("here");
			disableRadioButtons(false);
		}
	};
	const disableRadioButtons = (isDisabled) => {
		const radioInputs = document.querySelectorAll('input[type="radio"]');
		radioInputs.forEach((input) => {
			input.disabled = isDisabled;
		});
	};
	return (
		<>
			<div className=" shadow-gray-400 shadow-md  ring-slate-500 ring-2 rounded-md  mt-6 bg-slate-950 bg-opacity-50 text-gray-200 p-6 ">
				<div>
					<div className="mx-auto">
						<p
							className=" text-center font-thin"
							style={{ letterSpacing: "0.5em" }}
						>
							adjust biography length
						</p>
						<div className="flex mt-8 mb-3 mx-auto justify-evenly w-10/12">
							<div>
								<input
									checked={currentBio === 0}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									name="biolength"
									value={"shortest"}
									id="bio-shortest"
								/>
							</div>
							<div>
								<input
									checked={currentBio === 1}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									name="biolength"
									value={"short"}
									id="bio-short"
								/>
							</div>
							<div>
								<input
									checked={currentBio === 2}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									name="biolength"
									value={"long"}
									id="bio-long"
								/>
							</div>
							<div>
								<input
									checked={currentBio === 3}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									name="biolength"
									value={"longest"}
									id="bio-longest"
								/>
							</div>
						</div>
					</div>
					<div
						className="flex justify-between mx-auto w-9/12 font-thin"
						style={{ letterSpacing: "0.4em" }}
					>
						<span className="inline-block"> shortest</span>
						<span className="inline-block">longest</span>
					</div>
				</div>
				<div className="mt-6 px-20 mobile:px-6">
					<p
						ref={bioRef}
						className="inline text-2xl font-mono leading-8 tracking-wider overflow-x-hidden  "
					></p>
					<span className="cursor"></span>
				</div>
			</div>
		</>
	);
};
{
}
