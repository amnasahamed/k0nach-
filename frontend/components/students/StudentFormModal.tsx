import React from 'react';
import { Student } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import Modal from '../ui/Modal';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Partial<Student>;
    students: Student[];
    onStudentChange: (student: Partial<Student>) => void;
    onSave: (e: React.FormEvent) => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, student, students, onStudentChange, onSave }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={student.id ? "Edit Student" : "New Student"}>
            <form onSubmit={onSave} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-secondary-500 uppercase mb-2 ml-1">Personal Info</label>
                    <div className="space-y-3">
                        <Input required placeholder="Full Name" value={student.name || ''} onChange={e => onStudentChange({ ...student, name: e.target.value })} />
                        <Input required placeholder="Email Address" type="email" value={student.email || ''} onChange={e => onStudentChange({ ...student, email: e.target.value })} />
                        <Input required placeholder="Phone Number" type="tel" value={student.phone || ''} onChange={e => onStudentChange({ ...student, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                        <Input placeholder="University" value={student.university || ''} onChange={e => onStudentChange({ ...student, university: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-secondary-500 uppercase mb-2 ml-1">Notes & Status</label>

                    <Select
                        label="Referred By"
                        value={student.referredBy || ''}
                        onChange={e => onStudentChange({ ...student, referredBy: e.target.value })}
                        options={[
                            { value: '', label: 'None' },
                            ...students
                                .filter(s => s.id !== student.id)
                                .map(s => ({ value: s.id, label: s.name }))
                        ]}
                        className="mb-3"
                    />

                    <div className="space-y-1 mb-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Remarks</label>
                        <textarea
                            placeholder="Add remarks..."
                            className="w-full bg-secondary-100 border-none rounded-apple px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 ease-apple resize-none font-sans text-sm text-secondary-900 placeholder-secondary-400"
                            rows={3}
                            value={student.remarks || ''}
                            onChange={e => onStudentChange({ ...student, remarks: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-danger/5 rounded-apple border border-danger/10">
                        <input
                            type="checkbox"
                            id="flagStudent"
                            className="w-5 h-5 rounded-apple border-danger/30 text-danger focus:ring-danger/20"
                            checked={student.isFlagged || false}
                            onChange={e => onStudentChange({ ...student, isFlagged: e.target.checked })}
                        />
                        <label htmlFor="flagStudent" className="text-sm font-semibold text-danger">Flag this Student (Bad Payer/Difficult)</label>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Student</Button>
                </div>
            </form>
        </Modal>
    );
};

export default StudentFormModal;
