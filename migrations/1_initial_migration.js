const Admin = artifacts.require("Admin");
const StudentFactory = artifacts.require("StudentFactory");
const TeacherFactory = artifacts.require("TeacherFactory");
const ResultContract = artifacts.require("ResultContract");

module.exports = async function (deployer){
    await deployer.deploy(Admin);
    const adminInstance = await Admin.deployed();

    await deployer.deploy(TeacherFactory, adminInstance.address);
    const teacherInstance = await TeacherFactory.deployed();
    await deployer.deploy(StudentFactory,adminInstance.address,teacherInstance.address);
    const studentInstance = await StudentFactory.deployed();
    await deployer.deploy(ResultContract,adminInstance.address,studentInstance.address,teacherInstance.address);
};