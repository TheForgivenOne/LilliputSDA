"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, MessageSquare } from "lucide-react";
import { AdminPageShell, AdminTable, ConfirmDialog, Column } from "@/components/admin";
import Button from "@/components/ui/Button";
import { useFetch, deleteItem } from "@/hooks/useData";

type Testimonial = {
  id: string;
  createdAt: string;
  name: string;
  role: string | null;
  memberSince: string | null;
  content: string;
  isActive: boolean;
  order: number;
};

export default function TestimonialsAdminPage() {
  const { data: testimonials, refetch } = useFetch<Testimonial[]>("/api/testimonials");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "", role: "", memberSince: "", content: "", order: 0, isActive: true,
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/testimonials/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      refetch();
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await fetch(`/api/testimonials/${editingTestimonial.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/testimonials", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
        });
      }
      setIsEditing(false); setIsCreating(false); setEditingTestimonial(null);
      setFormData({ name: "", role: "", memberSince: "", content: "", order: 0, isActive: true });
      refetch();
    } catch {}
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name, role: testimonial.role || "", memberSince: testimonial.memberSince || "",
      content: testimonial.content, order: testimonial.order, isActive: testimonial.isActive,
    });
    setIsEditing(true);
  };

  const columns: Column<Testimonial>[] = [
    {
      key: "content",
      header: "Testimonial",
      render: (testimonial) => (
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900 dark:text-stone-100">{testimonial.name}</p>
              {testimonial.role && <span className="text-sm text-stone-500">({testimonial.role})</span>}
              {testimonial.memberSince && <span className="text-xs text-stone-400">Since {testimonial.memberSince}</span>}
            </div>
            <p className="text-sm text-stone-500 line-clamp-2 mt-1">{testimonial.content}</p>
          </div>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (testimonial) => (
        <button onClick={() => handleToggleActive(testimonial.id, testimonial.isActive)}
          className={`px-2 py-1 text-xs font-medium rounded-full ${testimonial.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"}`}
        >
          {testimonial.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (testimonial) => <span className="text-sm text-stone-500 dark:text-stone-400">{testimonial.order}</span>,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (testimonial) => <span className="text-sm text-stone-500 dark:text-stone-400">{format(new Date(testimonial.createdAt), "MMM d, yyyy")}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (testimonial) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(testimonial)} className="p-2 text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(testimonial.id)} className="p-2 text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const resetForm = () => { setIsEditing(false); setIsCreating(false); setEditingTestimonial(null); };

  return (
    <AdminPageShell
      title="Testimonials"
      description="Manage member testimonials shown on the homepage"
      addButtonLabel="Add Testimonial"
      addButtonHref=""
      isLoading={false}
    >
      <div className="space-y-4">
        <Button onClick={() => { setIsCreating(true); setIsEditing(true); setEditingTestimonial(null); setFormData({ name: "", role: "", memberSince: "", content: "", order: 0, isActive: true }); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <AdminTable data={testimonials || []} columns={columns} keyExtractor={(t) => t.id} emptyMessage="No testimonials yet. Add one to display on the homepage." />

      {(isEditing && (isCreating || editingTestimonial)) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface)] dark:bg-stone-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border-subtle)] dark:border-stone-600 rounded-lg bg-[var(--surface)] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[var(--primary)]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Role</label>
                  <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--border-subtle)] dark:border-stone-600 rounded-lg bg-[var(--surface)] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[var(--primary)]" placeholder="e.g., Member, Youth Leader" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Member Since</label>
                  <input type="text" value={formData.memberSince} onChange={(e) => setFormData({ ...formData, memberSince: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--border-subtle)] dark:border-stone-600 rounded-lg bg-[var(--surface)] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[var(--primary)]" placeholder="e.g., 2010" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border-subtle)] dark:border-stone-600 rounded-lg bg-[var(--surface)] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[var(--primary)]" rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-[var(--border-subtle)] dark:border-stone-600 rounded-lg bg-[var(--surface)] dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                  <label htmlFor="isActive" className="text-sm text-stone-700 dark:text-stone-300">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingTestimonial ? "Update" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </AdminPageShell>
  );
}
