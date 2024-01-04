import { Form, Input, message, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import teamService from "../../services/team";

const { Option } = Select;

function TeamForm({ show, setShow, reloadData, team, users }) {
  const formRef = useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (team) {
        // edit team
        // values._id = team._id;
        response = await teamService.editTeam(team._id, values);
      } else {
        // create project
        // values.owner = user._id;
        // values.members = [
        //   {
        //     user: user._id,
        //     role: "owner",
        //   },
        // ];
        response = await teamService.createTeam(values);
      }

      if (response.success) {
        message.success(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };
  return (
    <Modal
      title={team ? "EDYTUJ ZESPÓŁ" : "UTWÓRZ ZESPÓŁ"}
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText="Zapisz"
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={team}
      >
        <Form.Item label="Nazwa zespołu" name="name">
          <Input placeholder="Nazwa Zespołu" />
        </Form.Item>

        {/* Niżej masz do zrobienia listę wszystkich użytkowników i ewentualnie jeszcze jakieś formy jakbyś coś potrzebował/wymyślił dodatkowo */}
        {/* Być może możesz do tej listy jakoś wykorzystać usersSlice i reduxa w ogóle? ale to musiałbyś sprawdzić jak to ugryźć */}
        {/* Chyba najlepiej jakbyś passował z index.js tych userów, bo tam też ich użyjesz żeby wpisać liczbę userów w danym zespole */}
        {/* New Form.Item for user selection */}
        <Form.Item label="Użytkownicy" name="users">
          <Select
            mode="multiple"
            placeholder="Wybierz użytkowników"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {users.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.firstName}
              </Option> // Assuming each user has _id and name
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TeamForm;
