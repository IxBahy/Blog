import { useEffect, useRef, useState } from "react";

export const Biography = () => {
	const biographiesArray = [
		`Mohamed writes good articles`,
		`Mohamed is in love with web development, especially frontend he writes
        about JavaScript and soon about CSS and other topics related`,
		`Mohamed is a computer science student and is an enthusiastic web dev,
        he is currently learning JavaScript and other related web languages, tools, and topics and 
        will hopefully share all that he learns in this journey with you in articles so stay tuned`,
		`I honestly dont have a bigger bio so get this fried rice recipe from Chat GPT. Try this mouthwatering Chicken Fried Rice: Cook day-old rice. Sauté diced chicken, mixed veggies, garlic. Scramble eggs, combine all ingredients. Create a flavorful sauce with soy sauce, oyster sauce, sesame oil; drizzle over the rice. Season and stir briefly. Garnish with green onions. A delightful dish to savor! Customize by adding shrimp, pork, or more veggies to suit your taste. `,
	];
	const [biography, setBiography] = useState(biographiesArray[1]);
	const [currentBio, setCurrentBio] = useState(1);
	const [newBio, setNewBio] = useState(null);
	const [isWritingBio, setIsWritingBio] = useState(true);
	const bioRef = useRef(null);

	useEffect(() => {
		printTextLetters(0);
	}, [biography]);

	useEffect(() => {
		if (!isWritingBio && newBio !== null && newBio !== currentBio) {
			updateBio(newBio);
		}
	}, [isWritingBio, newBio]);

	const handleBioChange = (e) => {
		const bioType = e.target.value;
		switch (bioType) {
			case "shortest":
				setNewBio(0);
				break;
			case "short":
				setNewBio(1);
				break;
			case "long":
				setNewBio(2);
				break;
			case "longest":
				setNewBio(3);
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
	const printTextLetters = (index) => {
		setIsWritingBio(true);
		if (index < biography.length) {
			bioRef.current.innerHTML += biography.charAt(index);
			index++;
			setTimeout(() => {
				printTextLetters(index);
			}, 20);
		} else {
			console.log("ending");
			setIsWritingBio(false);
		}
	};

	return (
		<>
			<div className=" shadow-gray-400 shadow-md  ring-slate-400 ring-2 rounded-md  mt-6 bg-slate-950 bg-opacity-50 text-gray-200 p-6 ">
				<div>
					<div className="mx-auto">
						<p
							className=" text-center font-thin"
							style={{ letterSpacing: "0.5em" }}
						>
							adjust biography length
						</p>
						<div
							className="flex mt-8 mb-3 mx-auto justify-evenly w-10/12"
							role="radiogroup"
						>
							<div>
								<input
									checked={currentBio === 0}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									role="radio"
									name="biolength"
									value={"shortest"}
									id="bio-shortest"
									aria-checked={newBio === 0}
									aria-label={`shortest biography : ${biographiesArray[0]}`}
								/>
							</div>
							<div>
								<input
									checked={currentBio === 1}
									aria-checked={newBio === 0}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									role="radio"
									name="biolength"
									value={"short"}
									id="bio-short"
									aria-label={`short biography  : ${biographiesArray[1]}`}
								/>
							</div>
							<div>
								<input
									checked={currentBio === 2}
									aria-checked={newBio === 2}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									role="radio"
									name="biolength"
									value={"long"}
									id="bio-long"
									aria-label={`long biography  : ${biographiesArray[2]}`}
								/>
							</div>
							<div>
								<input
									checked={currentBio === 3}
									aria-checked={newBio === 3}
									onChange={handleBioChange}
									className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-500 checked:bg-slate-500 checked:ring-1 checked:ring-gray-100 checked:before:bg-gray-100 hover:before:opacity-10"
									type="radio"
									role="radio"
									name="biolength"
									value={"longest"}
									id="bio-longest"
									aria-label={`longest biography  : ${biographiesArray[3]}`}
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
						aria-hidden="true"
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
