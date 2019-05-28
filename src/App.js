import React, { useState } from 'react';
import connect from "@vkontakte/vkui-connect-promise";
import { View, Panel, PanelHeader, Input, FormLayout, FixedLayout, Button, ScreenSpinner, FormStatus } from '@vkontakte/vkui';

import VKStories from "vk-stories";

// Init VKStories
VKStories.init(connect);

const App = () => {
	const [ name, setName ] = useState("");
	const [ subject, setSubject ] = useState("");
	const [ status, setStatus ] = useState("none");

	const makeStory = () => {
		setStatus("making");
		VKStories.generateStoryFromTemplate(require("./assets/template.png"), [
			{
				font: "96px Arial Black",
				align: "center",
				color: "#FFFFFF",
				value: name,
				x: 540,
				y: 1133
			},
			{
				font: "68px Arial",
				align: "center",
				color: "#FFFFFF",
				value: subject,
				x: 540,
				y: 1494
			}
		])
			.then((story) => {
				VKStories.shareStory(6999763, story, { add_to_news: true })
					.then(() => setStatus("shared"))
					.catch((err) => {
						console.error(err);
						if (err.error_code === 1) {
							setStatus("sharingError");
						} else {
							setStatus("error");
						}
					})
			})
	};

	return (
		<View activePanel="home" popout={status === "making" ? <ScreenSpinner/>: null}>
			<Panel id="home">
				<PanelHeader>НЕсдам</PanelHeader>
				<FormLayout style={{ background: "white" }}>
					{
						status === "shared" ?
						<FormStatus title="Ура!" style={{background: '#528bcc', color: 'white'}}>
							Ваша история опубликована!
						</FormStatus> : null
					}
					{
						status === "sharingError" ?
							<FormStatus title="Жаль!" state="error">
								Мы не смогли получить твой токен, чтобы загрузить стори
							</FormStatus> : null
					}
					{
						status === "error" ?
							<FormStatus title="Ошибка!" state="error">
								Произошла неизвестная ошибка...
							</FormStatus> : null
					}
					<Input
						top="Имя человека, из-за которого не сдашь"
						value={name}
						onChange={(e) => setName(e.currentTarget.value.length <= 16 ? e.currentTarget.value : name)}
					/>
					<Input
						top="Предмет / экзамен который не сдашь"
						value={subject}
						onChange={(e) => setSubject(e.currentTarget.value.length <= 16 ? e.currentTarget.value : subject)}
					/>
				</FormLayout>
				<FixedLayout vertical="bottom" style={{ margin: 15, paddingRight: 30 }}>
					<Button
						size="xl"
						onClick={makeStory}
					>
						Опубликовать в истории
					</Button>
				</FixedLayout>
			</Panel>
		</View>
	);
};

export default App;
