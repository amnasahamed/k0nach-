import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Student, Assignment } from '../../types';
import * as DataService from '../../services/dataService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import Modal from '../ui/Modal';
import { useToast } from '../Layout';
import StudentList from './StudentList';
import StudentDetails from './StudentDetails';
import StudentFormModal from './StudentFormModal';

const StudentsPage: React.FC = () => {
    const { addToast } = useToast();
    const location = useLocation();
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Partial<Student>>({});
    const [historyStudent, setHistoryStudent] = useState<Student | null>(null);

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'pending' | 'vip'>('name');
    const [filterType, setFilterType] = useState<'all' | 'vip' | 'flagged' | 'referrer'>('all');

    useEffect(() => {
        refreshData();
    }, []);

    // Deep linking support from GlobalSearch
    useEffect(() => {
        if (location.state) {
            const state = location.state as any;
            if (state.selectStudent) {
                setSelectedStudentId(state.selectStudent);
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state]);

    const refreshData = async () => {
        try {
            const s = await DataService.getStudents();
            setStudents(s);
            const a = await DataService.getAssignments();
            setAssignments(a);
        } catch (error) {
            console.error("Failed to fetch data", error);
            addToast('Failed to load data', 'error');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent.name) return;
        try {
            const saved = await DataService.saveStudent(editingStudent as Student);
            setIsModalOpen(false);
            setEditingStudent({});
            await refreshData();
            setSelectedStudentId(saved.id);
            addToast('Student saved', 'success');
        } catch (error) {
            console.error("Failed to save student", error);
            addToast('Failed to save student', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this student?')) {
            try {
                await DataService.deleteStudent(id);
                await refreshData();
                if (selectedStudentId === id) setSelectedStudentId(null);
                addToast('Student deleted', 'success');
            } catch (error) {
                console.error("Failed to delete student", error);
                addToast('Failed to delete student', 'error');
            }
        }
    };

    const handleEdit = (student: Student) => {
        setHistoryStudent(null);
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const getStudentAssignments = (studentId: string) => assignments.filter(a => a.studentId === studentId);

    const filteredStudents = React.useMemo(() => {
        return students
            .filter(s => {
                const textMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.email.toLowerCase().includes(searchTerm.toLowerCase());

                if (!textMatch) return false;

                if (filterType === 'vip') {
                    const totalProjected = getStudentAssignments(s.id).reduce((sum, a) => sum + a.price, 0);
                    return totalProjected > 20000;
                }
                if (filterType === 'flagged') return s.isFlagged;
                if (filterType === 'referrer') {
                    return students.some(st => st.referredBy === s.id);
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                if (sortBy === 'revenue') {
                    const revA = getStudentAssignments(a.id).reduce((sum, asg) => sum + asg.price, 0);
                    const revB = getStudentAssignments(b.id).reduce((sum, asg) => sum + asg.price, 0);
                    return revB - revA;
                }
                if (sortBy === 'pending') {
                    const pendingA = getStudentAssignments(a.id).reduce((sum, asg) => sum + (asg.price - asg.paidAmount), 0);
                    const pendingB = getStudentAssignments(b.id).reduce((sum, asg) => sum + (asg.price - asg.paidAmount), 0);
                    return pendingB - pendingA;
                }
                if (sortBy === 'vip') {
                    const revA = getStudentAssignments(a.id).reduce((sum, asg) => sum + asg.price, 0);
                    const revB = getStudentAssignments(b.id).reduce((sum, asg) => sum + asg.price, 0);
                    return (revB > 20000 ? 1 : 0) - (revA > 20000 ? 1 : 0);
                }
                return 0;
            });
    }, [students, assignments, searchTerm, filterType, sortBy]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-apple-lg border border-secondary-100/50 shadow-ios-sm">
                    <div className="flex-1 min-w-[300px] group">
                        <Input
                            placeholder="Search student names, universities, or emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<svg className="w-5 h-5 text-secondary-400 group-focus-within:text-primary transition-apple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                            className="bg-secondary-50 border-secondary-100 focus:bg-white transition-apple"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            options={[
                                { value: 'name', label: 'Sort: Name' },
                                { value: 'revenue', label: 'Sort: Revenue' },
                                { value: 'pending', label: 'Sort: Pending Dues' },
                                { value: 'vip', label: 'Sort: VIP Status' }
                            ]}
                            className="w-44"
                            size="sm"
                        />
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            options={[
                                { value: 'all', label: 'Filter: All' },
                                { value: 'vip', label: 'Filter: VIP Only' },
                                { value: 'flagged', label: 'Filter: Flagged' },
                                { value: 'referrer', label: 'Filter: Referrers' }
                            ]}
                            className="w-44"
                            size="sm"
                        />
                        <Button onClick={() => { setEditingStudent({}); setIsModalOpen(true); }} className="shadow-ios-primary bg-gradient-to-br from-primary to-primary-600 border-none px-6">
                            + New Student
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
                <StudentList
                    students={filteredStudents}
                    assignments={assignments}
                    selectedId={selectedStudentId}
                    onSelect={(id, student) => {
                        setSelectedStudentId(id);
                        if (window.innerWidth < 1024) setHistoryStudent(student);
                    }}
                />

                <div className="hidden lg:block lg:col-span-2 bg-white rounded-apple-lg shadow-ios p-8 h-full overflow-y-auto border border-secondary-100 transition-apple">
                    {selectedStudentId ? (
                        (() => {
                            const student = students.find(s => s.id === selectedStudentId);
                            return student ? (
                                <StudentDetails
                                    student={student}
                                    students={students}
                                    assignments={assignments}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ) : null;
                        })()
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-secondary-400 bg-secondary-50/30 rounded-apple-lg border border-dashed border-secondary-200">
                            <div className="bg-primary/10 p-6 rounded-full mb-4 shadow-ios-sm">
                                <svg className="w-12 h-12 text-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">Select a student to view details</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={!!historyStudent} onClose={() => setHistoryStudent(null)} title={`${historyStudent?.name || 'Student'}'s Details`}>
                {historyStudent && (
                    <StudentDetails
                        student={historyStudent}
                        students={students}
                        assignments={assignments}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Modal>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                student={editingStudent}
                students={students}
                onStudentChange={setEditingStudent}
                onSave={handleSave}
            />
        </div>
    );
};

export default StudentsPage;
