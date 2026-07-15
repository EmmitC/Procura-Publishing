import { Fragment, useRef, useState } from 'react';
import { Plus, Trash2, Upload, ImageOff, Pencil, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { usePeople } from '../../state/PeopleContext';
import { readImageFile } from '../../lib/imageUpload';
import type { Person, PersonType } from '../../state/types';

function emptyForm() {
  return { name: '', title: '', recognition: '', bio: '', image: '' };
}

function PeopleSection({
  type,
  label,
  titleLabel,
  showRecognition,
}: {
  type: PersonType;
  label: string;
  titleLabel: string;
  showRecognition: boolean;
}) {
  const { people, addPerson, updatePerson, deletePerson } = usePeople();
  const list = people.filter((p) => p.type === type);
  const [form, setForm] = useState(emptyForm());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const singular = label.endsWith('s') ? label.slice(0, -1) : label;

  const handleAdd = () => {
    if (!form.name || !form.title) return;
    const person: Person = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      name: form.name,
      title: form.title,
      recognition: form.recognition,
      bio: form.bio,
      image: form.image,
    };
    addPerson(person);
    setForm(emptyForm());
    if (fileRef.current) fileRef.current.value = '';
    toast.success(`${singular} added`, { description: person.name });
  };

  const handleFormPhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      toast.error('Upload failed', { description: (err as Error).message });
    }
  };

  const handleExistingPhotoUpload = async (personId: string, file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      updatePerson(personId, { image: dataUrl });
      toast.success('Photo updated');
    } catch (err) {
      toast.error('Upload failed', { description: (err as Error).message });
    }
  };

  const handleDelete = (person: Person) => {
    if (!window.confirm(`Remove ${person.name}? This cannot be undone.`)) return;
    deletePerson(person.id);
    toast.success(`${singular} removed`, { description: person.name });
  };

  return (
    <div className="space-y-8">
      <p className="text-sm tracking-wider uppercase text-secondary">{label}</p>

      {list.length > 0 && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wider uppercase text-muted-foreground">
                <th className="text-left p-4">Photo</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">{titleLabel}</th>
                {showRecognition && <th className="text-left p-4">Recognition</th>}
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((person) => {
                const isExpanded = expandedId === person.id;
                const columnCount = showRecognition ? 5 : 4;
                return (
                  <Fragment key={person.id}>
                    <tr className="border-b border-border last:border-b-0">
                      <td className="p-4">
                        <label className="relative block w-12 h-12 rounded-full bg-card border border-border cursor-pointer group overflow-hidden">
                          {person.image ? (
                            <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                          )}
                          <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-colors flex items-center justify-center">
                            <Upload className="h-3 w-3 text-background opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleExistingPhotoUpload(person.id, e.target.files?.[0])}
                          />
                        </label>
                      </td>
                      <td className="p-4">
                        <input
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, { name: e.target.value })}
                          className="w-full min-w-[9rem] border border-transparent hover:border-border bg-transparent px-2 py-1 text-secondary focus:outline-none focus:border-secondary focus:bg-card transition-colors"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          value={person.title}
                          onChange={(e) => updatePerson(person.id, { title: e.target.value })}
                          className="w-full min-w-[9rem] border border-transparent hover:border-border bg-transparent px-2 py-1 text-muted-foreground focus:outline-none focus:border-secondary focus:bg-card transition-colors"
                        />
                      </td>
                      {showRecognition && (
                        <td className="p-4">
                          <input
                            value={person.recognition}
                            onChange={(e) => updatePerson(person.id, { recognition: e.target.value })}
                            placeholder="—"
                            className="w-full min-w-[9rem] border border-transparent hover:border-border bg-transparent px-2 py-1 text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:bg-card transition-colors"
                          />
                        </td>
                      )}
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : person.id)}
                            className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-secondary transition-colors"
                            aria-label={isExpanded ? `Collapse bio for ${person.name}` : `Edit bio for ${person.name}`}
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.5} />
                            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => handleDelete(person)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove ${person.name}`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-border last:border-b-0 bg-card">
                        <td colSpan={columnCount} className="p-4">
                          <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                            Bio — {person.name}
                          </label>
                          <textarea
                            defaultValue={person.bio}
                            onBlur={(e) => updatePerson(person.id, { bio: e.target.value })}
                            rows={4}
                            placeholder="Short biography..."
                            className="w-full border border-border bg-background px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary resize-none"
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border border-border p-8 max-w-3xl">
        <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">Add {singular}</p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder={titleLabel}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          {showRecognition && (
            <input
              placeholder="Recognition / Award (optional)"
              value={form.recognition}
              onChange={(e) => setForm({ ...form, recognition: e.target.value })}
              className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary md:col-span-2"
            />
          )}
        </div>

        <div className="mb-6">
          <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-3">Bio (optional)</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            placeholder="Short biography..."
            className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-3">Photo</label>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full shrink-0 bg-card border border-border overflow-hidden flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-border text-secondary text-xs tracking-wider uppercase cursor-pointer hover:border-secondary transition-colors">
              <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
              Upload Photo
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFormPhotoUpload(e.target.files?.[0])} />
            </label>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!form.name || !form.title}
          className="px-8 py-3 bg-secondary text-background text-sm tracking-wider uppercase flex items-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> Add {singular}
        </button>
      </div>
    </div>
  );
}

export function AdminPeople() {
  return (
    <div className="space-y-20">
      <PeopleSection type="author" label="Authors" titleLabel="Genre" showRecognition />
      <PeopleSection type="team" label="Team" titleLabel="Role" showRecognition={false} />
    </div>
  );
}
