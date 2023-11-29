import { UserType, UsersType } from "../../types/common";
import "./UsersList.scss";

type UsersListProps = {
  users: UsersType;
};

function UsersList(props: UsersListProps) {
  const { users } = props;

  return (
    <div className="userlist flex-col">
      {users.map((user: UserType) => (
        <div key={`${user.email}-${user.number}`} className="userlist__item flex-col">
          <p>
            <span>Email: </span>
            {`${user.email}`}
          </p>
          <p>
            <span>Номер: </span>
            {`${user.number}`}
          </p>
        </div>  
      ))}
    </div>
  );
}

export default UsersList;
