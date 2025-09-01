'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tag, Plus, Edit, Trash2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface EventCategory {
  _id: string;
  name: string;
  color: string;
  description?: string;
  icon?: string;
  eventCount: number;
}

const predefinedColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
  '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6', '#F59E0B'
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      color: '#3B82F6',
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Mock data - in production, this would fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories([
        {
          _id: '1',
          name: 'Work Meetings',
          color: '#3B82F6',
          description: 'Professional meetings and work-related events',
          eventCount: 23,
        },
        {
          _id: '2',
          name: 'Personal',
          color: '#10B981',
          description: 'Personal appointments and activities',
          eventCount: 12,
        },
        {
          _id: '3',
          name: 'Health & Fitness',
          color: '#F59E0B',
          description: 'Gym sessions, doctor appointments, wellness activities',
          eventCount: 8,
        },
        {
          _id: '4',
          name: 'Social Events',
          color: '#EC4899',
          description: 'Social gatherings, parties, and entertainment',
          eventCount: 15,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingCategory) {
        // Update existing category
        setCategories(prev =>
          prev.map(cat =>
            cat._id === editingCategory._id
              ? { ...cat, ...data }
              : cat
          )
        );
        toast.success('Category updated successfully');
      } else {
        // Create new category
        const newCategory: EventCategory = {
          _id: Date.now().toString(),
          ...data,
          eventCount: 0,
        };
        setCategories(prev => [...prev, newCategory]);
        toast.success('Category created successfully');
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      form.reset();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('Failed to save category');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  const openEditModal = (category: EventCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || '',
      color: category.color,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      description: '',
      color: '#3B82F6',
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="w-8 h-8" />
            Event Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your events with custom categories and colors
          </p>
        </div>
        
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCategory(category._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {category.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {category.eventCount} events
                  </Badge>
                  <div
                    className="w-8 h-8 rounded-lg border-2"
                    style={{ 
                      backgroundColor: category.color,
                      borderColor: category.color 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                {...form.register('name', { required: 'Name is required' })}
                placeholder="Enter category name..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...form.register('description')}
                placeholder="Enter category description..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  {...form.register('color')}
                  type="color"
                  className="w-16 h-10"
                />
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => form.setValue('color', color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}