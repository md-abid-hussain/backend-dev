const Employee = require('../model/Employee')

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees)
        return res.status(204).json({ message: 'No employee found' });
    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname)
        return res.status(400).json({ message: "firstname and lastname are required" });

    try {
        const result = await Employee.create({
            firstName: req.body.firstname,
            lastName: req.body.lastname
        })

        res.status(201).json(result);

    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: 'id required to make update' });
    const employee = await Employee.findOne({ _id: req.body.id })
    if (!employee)
        return res.status(400).json({ message: `No employee with id ${req.body.id}` });

    if (req.body.firstname)
        employee.firstName = req.body.firstname;
    if (req.body.lastname)
        employee.lastName = req.body.lastname;

    const result = await employee.save();
    res.json(result)
}

const removeEmployee = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: 'ID required' });
    const employee = await Employee.findOne({ _id: req.body.id })
    if (!employee)
        return res.status(400).json({ message: `Employee with ID ${req.body.id} not found` })
    const result = await Employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getEmployee = async (req, res) => {
    const employee = await Employee.findOne({ _id: req.params.id })
    if (!employee) {
        return res.status(400).json({ message: `Employee with ID ${req.params.id} not found` })
    }
    res.json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    removeEmployee,
    getEmployee
}