import SidebarNotes from './@sidebar/SidebarNotes';

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <SidebarNotes />
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}