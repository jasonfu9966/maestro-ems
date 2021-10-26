// this navbar may or may not be permanent

import Link from 'next/link';

export const Navbar = () => {
  return (
    <>
      <nav>
        <Link href='/'>Home</Link>| Placeholder Nav Bar |
        <Link href='/auth'>
          <a>Log in</a>
        </Link>
      </nav>
    </>
  );
};
