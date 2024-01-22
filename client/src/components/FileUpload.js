import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const FileUpload = ({ onFileUpload }) => {
	const handleBeforeUpload = async (file, fileList) => {
		await onFileUpload(fileList);
		return false;
	};

	const handleChange = (info) => {
		const { status, name } = info.file;
		if (status === "done") {
			message.success(`${name} - plik załączony pomyślnie.`);
		} else if (status === "error") {
			message.error(`${name} - załączenie pliku nie powiodło się.`);
		}
	};

	return (
		<Dragger
			name="file"
			multiple={true}
			beforeUpload={handleBeforeUpload}
			onChange={handleChange}
			style={{ padding: 20 }}
		>
			<p className="ant-upload-drag-icon">
				<InboxOutlined />
			</p>
			<p className="ant-upload-text">
				Kliknij lub przeciągnij plik, aby go przesłać.
			</p>
			<p className="ant-upload-hint">
				Możesz wybrać pojedynczy plik lub kilka. Możesz wybrać pliki o
				rozszerzeniach: pdf, jpg, jpeg, png.
			</p>
		</Dragger>
	);
};

export default FileUpload;
