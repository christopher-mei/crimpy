import React from 'react';

interface User {
  id?: string;
  name?: string;
  // add other user properties
}

interface HomeScreenProps {
  user: User;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {/* Add your home screen content */}
    </div>
  );
};

export default HomeScreen;