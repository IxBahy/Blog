import React, { useState } from "react";

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
        frameworks and open to use and learn different tech to solve problems in a more efficient way and will write about all this in here.
        he mainly works with React but he's flexable with the choices, he has some knowledge in the backend and in the design patterns too
        and also a certified AWS practitioner`,
	];
	const [biography, setBiography] = useState(biographiesArray[1]);
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
						<div className="flex mt-8 mx-auto justify-evenly w-10/12">
							<div>
								<input
									className="appearance-none rounded-full border-2  bg-gray-200 bg-opacity-80 border-slate-950 w-5 h-5"
									type="radio"
									name="biolength"
									value={"shortest"}
									id="bio-shortest"
								/>
							</div>
							<div>
								<input
									className="appearance-none rounded-full border-2  bg-gray-200 bg-opacity-80 border-slate-950 w-5 h-5"
									type="radio"
									name="biolength"
									value={"short"}
									id="bio-short"
								/>
							</div>
							<div>
								<input
									className="appearance-none rounded-full border-2  bg-gray-200 bg-opacity-80 border-slate-950 w-5 h-5"
									type="radio"
									name="biolength"
									value={"long"}
									id="bio-long"
								/>
							</div>
							<div>
								<input
									className="appearance-none rounded-full border-2  bg-gray-200 bg-opacity-80 border-slate-950 w-5 h-5"
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
				<p class="text-xl font-mono pt-6 leading-8 tracking-wider ">
					{biography}
				</p>
			</div>
		</>
	);
};
