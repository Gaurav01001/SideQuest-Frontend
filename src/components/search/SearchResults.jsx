const SearchResults = ({ users }) => {
  return (
    <div className="mt-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-3 border rounded-lg mb-2 cursor-pointer"
        >
          <h3>{user.username}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;