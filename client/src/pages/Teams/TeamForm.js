import { Form, Input, message, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import teamService from "../../services/team";
import { getAntdFormInputRules } from "../../utils/helpers";

const { Option } = Select;

// Nie wiem czy edycje zespołu nie lepiej zrobić tak, że po naciśnięciu na dany zespół przenosi cie do profilu zespołu (analogicznie jak masz profil uzytkownika) i tam jako admin możesz zmienić nazwę i np usunąć lub dodać userów do zespołu. Profil zespołu i tak by ci się przydał myślę, więc może warto
// to tak zrobić. A tworzenie zespolu zostaw jak jest jest git raczej.

function TeamForm({ show, setShow, reloadData, team, users }) {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [teamLeader, setTeamLeader] = useState(team?.teamLead?._id);

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (team) {
        // edit team
        // values._id = team._id;
        response = await teamService.editTeam(team._id, values);
      } else {
        console.log(`Wartości w teamie: ${values}`);
        // create team
        const payload = {
          name: values.name,
          teamLeadId: values.teamLead,
          memberIds: values.users,
        };
        console.log(
          `Wartości w teamie: ${payload.name}, ${payload.teamLeadId},${payload.memberIds}`
        );
        response = await teamService.createTeam(payload);
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
      message.error(error.message);
    }
  };

  const editInitialValues = team
    ? {
        name: team.name,
        teamLead: team.teamLead?._id,
        users: team.members.filter((member) => member !== team.teamLead?._id),
      }
    : {};

  console.log(`Oto lider: ${teamLeader}`);

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
        // initialValues={team ? { ...team, teamLead: team?.teamLead?._id } : null}
        // initialValues={team}
        initialValues={editInitialValues}
      >
        <Form.Item
          label="Nazwa zespołu"
          name="name"
          rules={getAntdFormInputRules}
        >
          <Input placeholder="Nazwa Zespołu" />
        </Form.Item>

        <Form.Item
          label="Team Leader"
          name="teamLead"
          rules={getAntdFormInputRules}
        >
          <Select
            placeholder="Wybierz lidera zespołu"
            disabled={team ? true : false}
            onChange={setTeamLeader}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {users
              .filter((user) => user.role !== "ADMIN") // Exclude users with the 'ADMIN' role
              .map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </Option>
              ))}
          </Select>
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
            {users
              .filter(
                (user) => user.role !== "ADMIN" && user._id !== teamLeader
              ) // Exclude users with the 'ADMIN' role
              .map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TeamForm;
