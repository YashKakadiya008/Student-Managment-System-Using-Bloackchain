// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Admin.sol";

contract TeacherFactory {
    Admin public adminContract;
    mapping(address => Teacher) public teachers;
    address[] public teacherAccounts;

    event TeacherCreated(
        address indexed eventCaller,
        address teacherAddress,
        string name,
        string subject,
        address account
    );
    event TeacherDeleted(address indexed eventCaller, address teacherAddress);

    constructor(address _adminAddress) {
        adminContract = Admin(_adminAddress);
    }

    function createTeacher(
        string memory _ipfsHash_photo,
        string memory _id,
        string memory _name,
        string memory _subject,
        string memory _gmail,
        address _account
    ) public {
        require(msg.sender == adminContract.admin(), "Not Allowed");
        require(
            address(teachers[_account]) == address(0),
            "Teacher already exists"
        );

        Teacher newTeacher = new Teacher(
            _ipfsHash_photo,
            _id,
            _name,
            _subject,
            _gmail,
            _account,
            adminContract.admin()
        );
        teachers[_account] = newTeacher;
        teacherAccounts.push(_account);

        emit TeacherCreated(
            msg.sender,
            address(newTeacher),
            _name,
            _subject,
            _account
        );
    }

    function getTeachersWithUpdateRequests()
        public
        view
        returns (address[] memory)
    {
        address[] memory teachersWithRequests = new address[](
            teacherAccounts.length
        );
        uint256 count = 0;

        for (uint256 i = 0; i < teacherAccounts.length; i++) {
            Teacher teacher = teachers[teacherAccounts[i]];
            if (teacher.isDetailsRequested()) {
                teachersWithRequests[count] = teacherAccounts[i];
                count++;
            }
        }

        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = teachersWithRequests[i];
        }
        return result;
    }

    function deleteTeacher(address _account) public {
        require(msg.sender == adminContract.admin(), "Not Allowed");
        require(
            address(teachers[_account]) != address(0),
            "Teacher does not exist"
        );

        delete teachers[_account];

        for (uint256 i = 0; i < teacherAccounts.length; i++) {
            if (teacherAccounts[i] == _account) {
                teacherAccounts[i] = teacherAccounts[
                    teacherAccounts.length - 1
                ];
                teacherAccounts.pop();
                break;
            }
        }

        emit TeacherDeleted(msg.sender, _account);
    }

    function isTeacher(address _account) public view returns (bool) {
        return address(teachers[_account]) != address(0);
    }

    function getTeacher(address _account) public view returns (address) {
        return address(teachers[_account]);
    }

    function getAllTeachers() public view returns (address[] memory) {
        return teacherAccounts;
    }

    function getAdminAddress() public view returns (address) {
        return adminContract.admin();
    }
}

contract Teacher {
    string public ipfsHash_photo;
    string public id;
    string public name;
    string public subject;
    string public gmail;
    address public account;
    address public admin;
    bool public detailsRequestedFlag;

    event AddSpreadsheet(address indexed eventCaller);
    event UpdateDetails(address indexed eventCaller);
    struct GoogleSpreadSheet {
        string sheetlink;
        string title;
    }

    mapping(string => GoogleSpreadSheet) private spreadsheets;
    GoogleSpreadSheet[] private studentSpreadsheets;

    constructor(
        string memory _ipfsHash_photo,
        string memory _id,
        string memory _name,
        string memory _subject,
        string memory _gmail,
        address _account,
        address _admin
    ) {
        ipfsHash_photo = _ipfsHash_photo;
        id = _id;
        name = _name;
        subject = _subject;
        gmail = _gmail;
        account = _account;
        admin = _admin;
        detailsRequestedFlag = false;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can manage teacher details");
        _;
    }

    function addSpreadSheet(
        string memory _sheetlink,
        string memory _title
    ) public {
        require(msg.sender == account, "Only teacher can add");
        GoogleSpreadSheet memory newSpreadSheet = GoogleSpreadSheet({
            sheetlink: _sheetlink,
            title: _title
        });
        spreadsheets[_sheetlink] = newSpreadSheet;
        studentSpreadsheets.push(newSpreadSheet);
        emit AddSpreadsheet(msg.sender);
    }

    function getSpreadSheets()
        public
        view
        returns (GoogleSpreadSheet[] memory)
    {
        return studentSpreadsheets;
    }

    function getSpreadSheet(
        string memory _sheetlink
    ) public view returns (GoogleSpreadSheet memory) {
        require(
            bytes(spreadsheets[_sheetlink].sheetlink).length > 0,
            "Spreadsheet not found"
        );
        return spreadsheets[_sheetlink];
    }

    function requestDetailsUpdate() public {
        require(msg.sender == account, "Only teacher can request updates");
        require(!detailsRequestedFlag, "Update already requested");
        detailsRequestedFlag = true;
    }

    function updateDetails(
        string memory _id,
        string memory _name,
        string memory _subject,
        string memory _gmail
    ) public onlyAdmin {
        id = _id;
        name = _name;
        subject = _subject;
        gmail = _gmail;
        detailsRequestedFlag = false;
        emit UpdateDetails(msg.sender);
    }

    function updateSubject(string memory _subject) public onlyAdmin {
        subject = _subject;
    }

    function isDetailsRequested() public view returns (bool) {
        return detailsRequestedFlag;
    }
}
