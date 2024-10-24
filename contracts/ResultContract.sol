// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./StudentFactory.sol";
import "./TeacherFactory.sol";

contract ResultContract {
    Admin public adminContract;
    StudentFactory public studentFactory;
    TeacherFactory public teacherFactory;

    struct Result {
        string resultHash;
    }

    struct SemesterResult {
        string semesterName;
        mapping(address => Result) studentResults;
        address[] studentAddresses;
    }

    event createSemesterResultevent(address EventCaller);
    event addStudentResultevent(address EventCaller);

    mapping(uint256 => SemesterResult) public semesterResults;
    uint256 public semesterCount = 0;

    modifier onlyAdmin() {
        require(
            msg.sender == adminContract.admin(),
            "Only admin can perform this action"
        );
        _;
    }

    modifier onlyAssignedTeacher(address _student) {
        require(
            teacherFactory.isTeacher(msg.sender),
            "Only a teacher can add results"
        );
        _;
    }

    constructor(
        address _adminAddress,
        address _studentFactoryAddress,
        address _teacherFactoryAddress
    ) {
        adminContract = Admin(_adminAddress);
        studentFactory = StudentFactory(_studentFactoryAddress);
        teacherFactory = TeacherFactory(_teacherFactoryAddress);
    }

    function createSemesterResult(
        string memory _semesterName
    ) public onlyAdmin {
        semesterResults[semesterCount].semesterName = _semesterName;
        semesterCount++;
        emit createSemesterResultevent(msg.sender);
    }

    function addStudentResult(
        uint256 _semesterId,
        address _student,
        string memory _resultHash
    ) public onlyAssignedTeacher(_student) {
        require(_semesterId < semesterCount, "Semester does not exist");
        require(
            bytes(
                semesterResults[_semesterId].studentResults[_student].resultHash
            ).length == 0,
            "Result already exists for this student"
        );

        semesterResults[_semesterId].studentResults[_student] = Result(
            _resultHash
        );
        semesterResults[_semesterId].studentAddresses.push(_student);
        emit addStudentResultevent(msg.sender);
    }

    function getStudentResult(
        uint256 _semesterId,
        address _student
    ) public view returns (string memory) {
        require(_semesterId < semesterCount, "Semester does not exist");
        return semesterResults[_semesterId].studentResults[_student].resultHash;
    }

    function getAllStudentsForSemester(
        uint256 _semesterId
    ) public view returns (address[] memory) {
        require(_semesterId < semesterCount, "Semester does not exist");
        return semesterResults[_semesterId].studentAddresses;
    }

    function verifyResult(
        uint256 _semesterId,
        address _student,
        string memory _hashToCheck
    ) public view returns (bool) {
        require(_semesterId < semesterCount, "Semester does not exist");

        return
            keccak256(
                abi.encodePacked(
                    semesterResults[_semesterId]
                        .studentResults[_student]
                        .resultHash
                )
            ) == keccak256(abi.encodePacked(_hashToCheck));
    }
}
