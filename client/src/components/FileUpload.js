import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const FileUpload = ({ onFileUpload }) => {
	const handleBeforeUpload = async (file, fileList) => {
		// Call the file upload handler passed from the parent component
		await onFileUpload(fileList);

		// Return false to prevent the Upload component from auto-uploading
		return false;
	};

	const handleChange = (info) => {
		const { status, name } = info.file;
		if (status === "done") {
			message.success(`${name} file uploaded successfully.`);
		} else if (status === "error") {
			message.error(`${name} file upload failed.`);
		}
	};

	return (
		<Dragger
			name="file"
			multiple={true}
			beforeUpload={handleBeforeUpload}
			onChange={handleChange}
			style={{ padding: 20 }} // You can adjust the styling as needed
		>
			<p className="ant-upload-drag-icon">
				<InboxOutlined />
			</p>
			<p className="ant-upload-text">
				Kliknij lub przeciągnij plik, aby go przesłać.
			</p>
			<p className="ant-upload-hint">
				Możesz wybrać pojedynczy plik lub kilka. Przeciągnij pliki tutaj lub
				kliknij, aby wybrać.
			</p>
		</Dragger>
	);
};

export default FileUpload;
