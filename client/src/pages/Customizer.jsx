import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { getRandomPrompt } from '../utils';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import { DecalTypes, EditorTabs, FilterTabs } from '../config/constants';
import { displayLoading, getScreenshot, hideLoading, reader } from '../config/helpers';
import { fadeAnimation, slideAnimation } from '../config/motion';
import state from '../store';

const Customizer = () => {
	const snap = useSnapshot(state);

	const [form, setForm] = useState({
		name: '',
		prompt: '',
		photo: '',
	});

	const [file, setFile] = useState('');
	const [prompt, setPrompt] = useState('');
	const [generatingImg, setGeneratingImg] = useState(false);

	const [activeEditorTab, setActiveEditorTab] = useState('');
	const [activeFilterTab, setActiveFilterTab] = useState({
		logoShirt: true,
		stylishShirt: false,
	});

	const mainLoader = document.querySelector('#mainLoading');

	if (!snap.intro) {
		mainLoader.classList.add('customizer');
		setTimeout(() => {
			mainLoader.classList.add('disabled');
		}, 5000);
	}

	const handleSurpriseMe = () => {
		const randomPrompt = getRandomPrompt(form.prompt);
		setForm({ ...form, prompt: randomPrompt });
	};

	const generateImage = async () => {
		if (form.prompt) {
			try {
				setGeneratingImg(true);
				const response = await fetch('http://localhost:8080/api/v1/dalle', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt: form.prompt,
				}),
				});
		
				const data = await response.json();
				setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
			} catch (err) {
				alert(err);
			} finally {
				setGeneratingImg(false);
			}
		} else {
			alert('Please provide proper prompt');
		}
	};

	const handleSubmit = async type => {
		if (form.prompt) return alert('Please enter a prompt');
		try {
			setGeneratingImg(true);
			displayLoading();

			//* call our backend to generate an AI image
			const response = await fetch(`http://localhost:8080/api/v1/post`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...form }),
			});

			await response.json();
			alert('Success');
		} catch (error) {
			alert('error',);
		} finally {
			setGeneratingImg(false);
			// setActiveEditorTab('');
		}
	};
	const handleDecals = (type, result) => {
		const decalType = DecalTypes[type];
		state[decalType.stateProperty] = result;
		if (!activeFilterTab[decalType.filterTab]) {
			handleActiveFilterTab(decalType.filterTab);
		}
	};

	const handleActiveFilterTab = tabName => {
		switch (tabName) {
			case 'logoShirt':
				state.isLogoTexture = !activeFilterTab[tabName];
				break;
			case 'stylishShirt':
				state.isFullTexture = !activeFilterTab[tabName];
				break;
		}

		//* after setting the state, activeFilterTab is updated
		setActiveFilterTab(prevState => {
			return {
				...prevState,
				[tabName]: !prevState[tabName],
			};
		});
	};

	const readFile = type => {
		if (file) {
			reader(file).then(result => {
				handleDecals(type, result);
				setActiveEditorTab('');
			});
		} else {
			alert('Please upload a file');
		}
	};

	//* show tab content depending on the activeTab
	const generateTabContent = () => {
		switch (activeEditorTab) {
			case 'colorpicker':
				return <ColorPicker />;

			case 'filepicker':
				return <FilePicker file={file} setFile={setFile} readFile={readFile} />;

			case 'aipicker':
				return (
					<AIPicker
						prompt={prompt}
						setPrompt={setPrompt}
						generatingImg={generatingImg}
						handleSubmit={handleSubmit}
					/>
				);

			default:
				return null;
		}
	};

	const toggleEditorTab = tabName => {
		switch (tabName) {
			case 'colorpicker':
				if (activeEditorTab === tabName) {
					setActiveEditorTab('');
				} else {
					setActiveEditorTab(tabName);
				}
				break;
			case 'filepicker':
				if (activeEditorTab === tabName) {
					setActiveEditorTab('');
				} else {
					setActiveEditorTab(tabName);
				}
				break;
			case 'aipicker':
				if (activeEditorTab === tabName) {
					setActiveEditorTab('');
				} else {
					setActiveEditorTab(tabName);
				}
				break;
		}
	};

	const goBack = () => {
		mainLoader.classList.add('disabled');
		setActiveEditorTab('');
		state.intro = true;
	};

	return (
		<AnimatePresence>
			{!snap.intro && (
				<>
					<motion.div
						key='pickers'
						className='absolute top-0 left-0 z-10 '
						{...slideAnimation('left')}
					>
						<div className='flex items-center min-h-screen'>
							<div className='editortabs-container tabs'>
								{EditorTabs.map(tab => (
									<Tab key={tab.name} tab={tab} handleClick={() => toggleEditorTab(tab.name)} />
								))}
								{generateTabContent(activeEditorTab)}
							</div>
						</div>
					</motion.div>

					<motion.div key='goBack' className='absolute z-10 top-5 right-5' {...fadeAnimation}>
						<CustomButton
							type='filled'
							title='Go Back'
							handleClick={() => goBack()}
							customStyles='w-fit px-4 font-bold lg:text-[2vmin] text-[100%]'
						/>
					</motion.div>

					<motion.div key='tabs' className='filtertabs-container forIOS' {...slideAnimation('up')}>
						{FilterTabs.map(tab => (
							<Tab
								key={tab.name}
								tab={tab}
								isFilterTab
								isActiveTab={activeFilterTab[tab.name]}
								handleClick={() => {
									handleActiveFilterTab(tab.name);
									getScreenshot(tab.name);
								}}
							/>
						))}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default Customizer;