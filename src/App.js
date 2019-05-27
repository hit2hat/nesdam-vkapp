import React, { useState } from 'react';
import connect from "@vkontakte/vkui-connect-promise";
import { View, Panel, PanelHeader, Input, FormLayout, FixedLayout, Button, ScreenSpinner, FormStatus } from '@vkontakte/vkui';

const generateStory = (name, subject, callback) => {
	const canvas = document.createElement("canvas");
	canvas.width = 1080;
	canvas.height = 1920;

	const ctx = canvas.getContext("2d");

	ctx.textAlign = "center";
	ctx.fillStyle = "#FFFFFF";

	const background = new Image();
	background.onload = () => {
		ctx.drawImage(background, 0, 0);
		ctx.font = "96px Arial Black";
		ctx.fillText(name, 540, 1133);
		ctx.font = "68px Arial";
		ctx.fillText(subject, 540, 1494);
		callback(canvas.toDataURL());
	};
	background.src = require("./assets/template.png");
};

const App = () => {
	const [ name, setName ] = useState("");
	const [ subject, setSubject ] = useState("");
	const [ status, setStatus ] = useState("none");

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
					<Input
						top="Имя"
						value={name}
						onChange={(e) => setName(e.currentTarget.value.length <= 16 ? e.currentTarget.value : name)}
					/>
					<Input
						top="Предмет / экзамен (в родительном падеже)"
						value={subject}
						onChange={(e) => setSubject(e.currentTarget.value.length <= 16 ? e.currentTarget.value : subject)}
					/>
				</FormLayout>
				<FixedLayout vertical="bottom" style={{ margin: 15, paddingRight: 30 }}>
					<Button
						size="xl"
						onClick={() => {
							setStatus("making");
							generateStory(name, subject, (story) => {
								connect.send("VKWebAppGetAuthToken", { app_id: 6999763, scope: "stories"})
									.then((response) => {
										const access_token = response.data.access_token;
										connect.send("VKWebAppCallAPIMethod", {
											method: "stories.getPhotoUploadServer",
											params: {
												access_token,
												user_ids: "318254557",
												link_text: "open",
												link_url: "https://vk.com/app6999763",
												v: "5.95"
											}
										})
											.then((response) => {
												const uploadUrl = response.data.response.upload_url;

												const request = new FormData();
												request.append("file", story);

												fetch("https://cors-anywhere.herokuapp.com/" + uploadUrl, {
													method: "POST",
													body: request
												})
													.then(r => r.json())
													.then(console.log)
													.catch(console.error);
											})
											.catch(console.error)
									})
									.catch(() => setStatus("sharingError"));
							});
						}}
					>
						Опубликовать в истории
					</Button>
				</FixedLayout>
			</Panel>
		</View>
	);
};

export default App;
