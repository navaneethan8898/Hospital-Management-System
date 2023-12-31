import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles.css';
import DashboardHeader from '../../components/DashboardHeader';
const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [patientId, setPatientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = async () => {
    await axios.get('https://8080-ddeaddfaafedbeeafbdefaebabceebadffeaeaadbdbabf.project.examly.io/billing').then((response) => {
      setPayments(response.data);
    });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const submitDelete = async (id) => {
    await axios.delete(`https://8080-ddeaddfaafedbeeafbdefaebabceebadffeaeaadbdbabf.project.examly.io/billing/${id}`).then(() => {
      fetchPayments();
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {
            submitDelete(id);
            Swal.fire({
                icon: 'success',
                text: "Success",
                title: 'Record Deleted',
                showConfirmButton: false,
                timer: 1000
            })
        }
    })
}
  const handleEdit = (payment) => {
    setEdit(true);
    setId(payment.id);
    setDate(payment.date);
    setAmount(payment.amount);
    setTreatmentDescription(payment.treatment_description);
    setPatientId(payment.patient_id);
  };

  const handleNewPayment = (e) => {
    e.preventDefault();
    setAdd(true);
    setEdit(false);
    clearFields();
  };

  const handleBack = (e) => {
    e.preventDefault();
    setAdd(false);
    setEdit(false);
    clearFields();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedPayment = {
      id: id,
      date: date,
      amount: amount,
      treatment_description: treatmentDescription,
      patient_id: patientId,
    };
    await axios.put('https://8080-ddeaddfaafedbeeafbdefaebabceebadffeaeaadbdbabf.project.examly.io/billing', updatedPayment).then(() => {
      Swal.fire({
        icon: 'success',
        text: 'Updated',
        title: 'Payment Updated Successfully',
        showConfirmButton: false,
        timer: 1000,
      });
      setEdit(false);
      clearFields();
      fetchPayments();
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong.Please check the details',
    })
      console.log(err);
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payment = {
      date: date,
      amount: amount,
      treatment_description: treatmentDescription,
      patient_id: patientId,
    };
    await axios.post('https://8080-ddeaddfaafedbeeafbdefaebabceebadffeaeaadbdbabf.project.examly.io/billing', payment).then((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Payment Added',
        showConfirmButton: false,
        timer: 1000,
      });
      fetchPayments();
      setAdd(false);
      clearFields();
    }).catch((err) => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong.Please check the details',
    })
    });
  };

  const clearFields = () => {
    setId('');
    setDate('');
    setAmount('');
    setTreatmentDescription('');
    setPatientId('');
  };

  return (
    <div>
      <div className="dashboard-content">
        {!edit && !add && <DashboardHeader btnText="New Payment" onClick={handleNewPayment} />}
        {(edit || add) && <DashboardHeader btnText="Back to Payments" onClick={handleBack} />}
        {!edit && !add && (
          <div className="dashboard-content-container">
            <div className="dashboard-content-header">
              <h2>Payment List</h2>
              <div className='dashboard-content-search'>
                <input
                  type='text'
                  placeholder='Search..'
                  className='dashboard-content-input'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  min="1"
                  inputMode="numeric"
                />
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Treatment Description</th>
                  <th>Patient ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {payments.length !== 0 && (
                <tbody>
                  {payments.map((payment) => {
                    return (
                      <tr key={payment.id}>
                        <td><span>{payment.id}</span></td>
                        <td><span>{payment.date}</span></td>
                        <td><span>{payment.amount}</span></td>
                        <td><span>{payment.treatment_description}</span></td>
                        <td><span>{payment.patient_id}</span></td>
                        <td>
                          <button onClick={() => handleEdit(payment)} className="edit-save-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(payment.id)} className="edit-back-btn">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        )}
        {edit && (
          <div className="form-elements">
            <div className="dashboard-content-header">
              <h2>Edit Payment Details</h2>
            </div>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="paymentid" className='form_label'>Payment ID:</label><br />
              <input type="text" value={id} id="paymentid" className='form-inputs' onChange={(e) => setId(e.target.value)} readOnly />
              <br /><label htmlFor="pdate" className='form_label'>Date:</label><br />
              <input type="date" value={date} id="pdate" className='form-inputs' onChange={(e) => setDate(e.target.value)} required />
              <br /><label htmlFor="amount" className='form_label'>Amount:</label><br />
              <input type="text" value={amount} id="amount" className='form-inputs' onChange={(e) => setAmount(e.target.value)} required />
              <br /><label htmlFor="desc" className='form_label'>Treatment Description:</label><br />
              <input type="text" value={treatmentDescription} id="desc" className='form-inputs' onChange={(e) => setTreatmentDescription(e.target.value)} required />
              <br /><label htmlFor="patientid" className='form_label'>Patient ID:</label><br />
              <input type="text" value={patientId} id="patientid" className='form-inputs' required />
              <br /><button type="submit" className="save-btn">Update</button>
              <button className="back-btn" onClick={handleBack}>Cancel</button>
            </form>
          </div>
        )}
        {add && (
          <div className="form-elements">
            <div className="dashboard-content-header">
              <h2>Add Payment</h2>
            </div>
            <form onSubmit={handleAddSubmit}>
              <label htmlFor="pdate" className='form_label'>Date:</label><br />
              <input type="date" value={date} id="pdate" className='form-inputs' onChange={(e) => setDate(e.target.value)} required />
              <br /><label htmlFor="amount" className='form_label'>Amount:</label><br />
              <input type="number" className='form-inputs' id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              <br /><label htmlFor="desc" className='form_label'>Treatment Description:</label><br />
              <input type="text" className='form-inputs' id="desc" value={treatmentDescription} onChange={(e) => setTreatmentDescription(e.target.value)} required />
              <br /><label htmlFor="patientid" className='form_label'>Patient ID:</label><br />
              <input type="number" className='form-inputs' id="patientid" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
              <br /><button type="submit" className="save-btn">Save</button>
              <button className="back-btn" onClick={handleBack}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;