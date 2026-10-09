import {
  INITIAL_COURSES,
  INITIAL_GROUPS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_TEACHER_SALARIES
} from '../data/mockData';
import {
  Course,
  DirectorSettings,
  Group,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Product,
  ShopOrder,
  Student,
  Teacher,
  TeacherSalaryRecord
} from '../types';

const STORAGE_KEYS = {
  TEACHERS: 'avlod_director_teachers_v1',
  STUDENTS: 'avlod_director_students_v1',
  GROUPS: 'avlod_director_groups_v1',
  COURSES: 'avlod_director_courses_v1',
  PAYMENTS: 'avlod_director_payments_v1',
  SALARIES: 'avlod_director_salaries_v1',
  PRODUCTS: 'avlod_director_products_v1',
  ORDERS: 'avlod_director_orders_v1',
  SETTINGS: 'avlod_director_settings_v1'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore local storage errors
  }
}

export const DirectorService = {
  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  },

  async createTeacher(data: Omit<Teacher, 'id' | 'createdAt' | 'groupsCount' | 'studentsCount' | 'attendanceRate' | 'monthlySalary'>): Promise<Teacher> {
    const teachers = await this.getTeachers();
    const newTeacher: Teacher = {
      ...data,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      groupsCount: 0,
      studentsCount: 0,
      attendanceRate: 100,
      monthlySalary: 0
    };
    teachers.unshift(newTeacher);
    setStored(STORAGE_KEYS.TEACHERS, teachers);
    return newTeacher;
  },

  async updateTeacher(id: string, updates: Partial<Teacher>): Promise<Teacher> {
    const teachers = await this.getTeachers();
    const index = teachers.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ustoz topilmadi');
    teachers[index] = { ...teachers[index], ...updates };
    setStored(STORAGE_KEYS.TEACHERS, teachers);
    return teachers[index];
  },

  async deleteTeacher(id: string): Promise<void> {
    const teachers = await this.getTeachers();
    const filtered = teachers.filter(t => t.id !== id);
    setStored(STORAGE_KEYS.TEACHERS, filtered);
  },

  // Students
  async getStudents(): Promise<Student[]> {
    return getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },

  async createStudent(payload: {
    firstName: string;
    lastName: string;
    phone: string;
    courseId: string;
    courseName: string;
    groupId: string;
    groupName: string;
    teacherName: string;
    monthlyPayment: number;
  }): Promise<{ student: Student; generatedId: string; generatedPassword: string }> {
    const students = await this.getStudents();
    
    // Generate 8 digit ID
    const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
    // Generate 6 alphanumeric random password e.g. A7m2K9
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let tempPass = '';
    for (let i = 0; i < 6; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newStudent: Student = {
      id: `s-${Date.now()}`,
      studentId: random8,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`,
      phone: payload.phone || '+998 90 000 00 00',
      courseId: payload.courseId,
      courseName: payload.courseName,
      groupId: payload.groupId,
      groupName: payload.groupName,
      teacherName: payload.teacherName,
      monthlyPayment: payload.monthlyPayment,
      paymentStatus: 'pending',
      attendanceRate: 100,
      coins: 50, // Welcome bonus
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    students.unshift(newStudent);
    setStored(STORAGE_KEYS.STUDENTS, students);

    return {
      student: newStudent,
      generatedId: random8,
      generatedPassword: tempPass
    };
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const students = await this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Talaba topilmadi');
    students[index] = { ...students[index], ...updates };
    setStored(STORAGE_KEYS.STUDENTS, students);
    return students[index];
  },

  async deleteStudent(id: string): Promise<void> {
    const students = await this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    setStored(STORAGE_KEYS.STUDENTS, filtered);
  },

  // Groups
  async getGroups(): Promise<Group[]> {
    return getStored<Group[]>(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
  },

  async createGroup(data: Omit<Group, 'id' | 'studentsCount'>): Promise<Group> {
    const groups = await this.getGroups();
    const newGroup: Group = {
      ...data,
      id: `g-${Date.now()}`,
      studentsCount: data.studentIds?.length || 0
    };
    groups.unshift(newGroup);
    setStored(STORAGE_KEYS.GROUPS, groups);
    return newGroup;
  },

  async updateGroup(id: string, updates: Partial<Group>): Promise<Group> {
    const groups = await this.getGroups();
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Guruh topilmadi');
    const updated = { ...groups[index], ...updates };
    if (updates.studentIds) {
      updated.studentsCount = updates.studentIds.length;
    }
    groups[index] = updated;
    setStored(STORAGE_KEYS.GROUPS, groups);
    return groups[index];
  },

  async deleteGroup(id: string): Promise<void> {
    const groups = await this.getGroups();
    setStored(STORAGE_KEYS.GROUPS, groups.filter(g => g.id !== id));
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    return getStored<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  },

  async createCourse(data: Omit<Course, 'id' | 'studentsCount' | 'groupsCount'>): Promise<Course> {
    const courses = await this.getCourses();
    const newCourse: Course = {
      ...data,
      id: `c-${Date.now()}`,
      studentsCount: 0,
      groupsCount: 0
    };
    courses.unshift(newCourse);
    setStored(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const courses = await this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Kurs topilmadi');
    courses[index] = { ...courses[index], ...updates };
    setStored(STORAGE_KEYS.COURSES, courses);
    return courses[index];
  },

  async deleteCourse(id: string): Promise<void> {
    const courses = await this.getCourses();
    setStored(STORAGE_KEYS.COURSES, courses.filter(c => c.id !== id));
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    return getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  async addPayment(data: {
    studentId: string;
    studentPublicId: string;
    studentName: string;
    courseName: string;
    groupName: string;
    amount: number;
    method: PaymentMethod;
    receiptNumber?: string;
    note?: string;
  }): Promise<Payment> {
    const payments = await this.getPayments();
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      studentId: data.studentId,
      studentPublicId: data.studentPublicId,
      studentName: data.studentName,
      courseName: data.courseName,
      groupName: data.groupName,
      amount: data.amount,
      method: data.method,
      receiptNumber: data.receiptNumber,
      date: dateFormatted,
      status: 'paid',
      note: data.note
    };

    payments.unshift(newPayment);
    setStored(STORAGE_KEYS.PAYMENTS, payments);

    // Update student paymentStatus to 'paid'
    const students = await this.getStudents();
    const sIdx = students.findIndex(s => s.id === data.studentId);
    if (sIdx !== -1) {
      students[sIdx].paymentStatus = 'paid';
      // Reward coins for on-time payment
      students[sIdx].coins += 50;
      setStored(STORAGE_KEYS.STUDENTS, students);
    }

    return newPayment;
  },

  // Teacher Salaries
  async getSalaries(): Promise<TeacherSalaryRecord[]> {
    return getStored<TeacherSalaryRecord[]>(STORAGE_KEYS.SALARIES, INITIAL_TEACHER_SALARIES);
  },

  async markSalaryPaid(id: string): Promise<TeacherSalaryRecord> {
    const salaries = await this.getSalaries();
    const index = salaries.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Oylik hisob topilmadi');
    salaries[index].status = 'paid';
    setStored(STORAGE_KEYS.SALARIES, salaries);
    return salaries[index];
  },

  // Shop Products
  async getProducts(): Promise<Product[]> {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    products.unshift(newProduct);
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Mahsulot topilmadi');
    products[index] = { ...products[index], ...updates };
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return products[index];
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    setStored(STORAGE_KEYS.PRODUCTS, products.filter(p => p.id !== id));
  },

  // Orders
  async getOrders(): Promise<ShopOrder[]> {
    return getStored<ShopOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async updateOrderStatus(id: string, status: ShopOrder['status']): Promise<ShopOrder> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Buyurtma topilmadi');
    orders[index].status = status;
    setStored(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  // Settings
  async getSettings(): Promise<DirectorSettings> {
    return getStored<DirectorSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<DirectorSettings>): Promise<DirectorSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }
};
