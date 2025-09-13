'use client';
import Link from 'next/link';
import { useState } from 'react';
import Input from '@/components/inputs/Input';

export default function CreateWorkspacePage() {
  const [members, setMembers] = useState([{ email: '', role: 'Member' }]);

  const addMember = () => {
    setMembers([...members, { email: '', role: 'Member' }]);
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    (newMembers[index] as any)[field] = value;
    setMembers(newMembers);
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Welcome !</h2>
      <h3 className="text-lg mb-6">Create your workspace</h3>

      <form className="space-y-4">
        {/* Workspace name */}
        <Input
          label="Workspace name"
          placeholder="Enter workspace name"
          name="workspace"
          required
        />

        <div className="space-y-3">
          <label className="block font-medium text-sm">Invite others (optional)</label>
          {members.map((member, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email to invite"
                value={member.email}
                onChange={(e) => updateMember(idx, 'email', e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <select
                value={member.role}
                onChange={(e) => updateMember(idx, 'role', e.target.value)}
                className="w-32 border p-2 rounded"
              >
                <option>Member</option>
                <option>Manager</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addMember}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add more member
          </button>
        </div>

        <Link
          href="/"
          className="block w-full bg-black text-white py-2 rounded mt-4 text-center"
        >
          Create
        </Link>
      </form>
    </>
  );
}
